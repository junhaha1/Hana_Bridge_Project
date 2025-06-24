package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.openai.PromptFactory;
import com.adela.hana_bridge_beapi.config.openai.PromptProperties;
import com.adela.hana_bridge_beapi.dto.openai.*;
import com.adela.hana_bridge_beapi.repository.CategoryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.util.concurrent.RateLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import reactor.util.retry.Retry;

import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class OpenAiService {
    private final WebClient openAiWebClient;
    private final PromptProperties promptProperties;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final PromptFactory promptFactory;

    private final RateLimiter rateLimiter = RateLimiter.create(0.2);
    private final CategoryRepository categoryRepository;

    @Value("${openai.model}")
    private String model;

    private final String apiUrl = "/chat/completions";

    public void streamAnswerToClient(ClientRequest clientRequest, ResponseBodyEmitter emitter){
        PromptResult promptResult = null;
        StringBuilder fullResponseBuffer = new StringBuilder();
        int maxRetries = 3;

        //사용자 커스텀 프롬포트 사용
        if (clientRequest.getPromptLevel() == -1){
            promptResult = promptFactory.createCustomPromptResult(clientRequest.getRole(),
                    clientRequest.getForm(), clientRequest.getLevel(), clientRequest.getQuestion(), clientRequest.getQuestion());
        }
        else{ //기본값 사용
            promptResult = promptFactory.createPromptResult(clientRequest.getPromptLevel(), clientRequest.getQuestion());
        }

        List<ChatGPTRequest.Message> messages = new ArrayList<>();
        messages.add(new ChatGPTRequest.Message("system", promptResult.getPrompt()));
        messages.add(new ChatGPTRequest.Message("assistant", clientRequest.getPreContent()));
        messages.add(new ChatGPTRequest.Message("user", clientRequest.getQuestion()));

        streamWithQueue(messages, fullResponseBuffer, emitter, promptResult.getMaxTokens(), maxRetries);
    }

    private void streamWithQueue(List<ChatGPTRequest.Message> messages,
                                 StringBuilder buffer,
                                 ResponseBodyEmitter emitter,
                                 int maxTokens,
                                 int maxRetries) {
        Queue<List<ChatGPTRequest.Message>> messageQueue = new ArrayDeque<>();
        messageQueue.offer(messages); //초기 메세지 넣어두기

        AtomicInteger retryCounter = new AtomicInteger(maxRetries);
        AtomicReference<String> endStr = new AtomicReference<>("stop");
        Consumer<List<ChatGPTRequest.Message>> processMessages = new Consumer<>() {
            @Override
            public void accept(List<ChatGPTRequest.Message> messages) {
                rateLimiter.acquire();

                ChatGPTRequest chatGPTRequest = new ChatGPTRequest(
                        model,
                        messages,
                        maxTokens,
                        0.4,
                        true // stream 옵션
                );

                openAiWebClient.post()
                        .uri("https://api.openai.com/v1/chat/completions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.TEXT_EVENT_STREAM)
                        .bodyValue(chatGPTRequest)
                        .retrieve()
                        .bodyToFlux(String.class)
                        .retryWhen(
                            Retry.backoff(3, Duration.ofSeconds(5))
                                .filter(throwable -> {
                                    if (throwable instanceof WebClientResponseException) {
                                        int statusCode = ((WebClientResponseException) throwable).getRawStatusCode();
                                        return statusCode == 429 || statusCode >= 500; // 429 or 5xx
                                    }
                                    return false;
                                })
                                .onRetryExhaustedThrow((retryBackoffSpec, retrySignal) -> retrySignal.failure())
                        )
                        .doOnNext(chunk -> {
                            try {
                                // [DONE]은 JSON이 아니므로 따로 처리
                                // -> DONE이 오기전 finish_reason으로 처리 되겠지만 안전성을 위해 추가한 코드
                                if (!"[DONE]".equals(chunk.trim())) {
                                    emitter.send("data: " + chunk  + "\n\n");
                                    // 서버 내부 버퍼에는 content만 누적
                                    JsonNode jsonNode = objectMapper.readTree(chunk);
                                    // 현재 종료 조건
                                    JsonNode choices = jsonNode.path("choices");
                                    String reason = choices.get(0).path("finish_reason").asText();
                                    /*종료 조건 판단*/
                                    if (reason.equals("stop")) { // 현재 토큰 안에서 답변이 완료된 경우
                                        System.out.println("reason : " + reason);
                                        endStr.set(reason);
                                        return;
                                    } else if (reason.equals("length")) { //현재 토큰을 다 써서 토큰이 끊긴 경우
                                        System.out.println("reason : " + reason);
                                        endStr.set(reason);
                                        return;
                                    }

                                    if (choices.isArray() && choices.size() > 0) {
                                        JsonNode delta = choices.get(0).path("delta");
                                        JsonNode contentNode = delta.path("content");

                                        if (!contentNode.isMissingNode() && !contentNode.isNull()) {
                                            String content = contentNode.asText();
                                            buffer.append(content); // content만 누적
                                        }
                                    }
                                }
                            } catch (IOException e) {
                                emitter.completeWithError(e);
                            }
                        })
                        .doOnError(error -> {
                            emitter.completeWithError(error);
                        })
                        .doOnComplete(() -> {
                            if (endStr.get().equals("length") && retryCounter.getAndDecrement() > 0) {
                                System.out.println("continue");
                                List<ChatGPTRequest.Message> nextMessages = new ArrayList<>(messages);
                                nextMessages.add(new ChatGPTRequest.Message("assistant", buffer.toString()));
                                nextMessages.add(new ChatGPTRequest.Message("user", "문장을 이어서 계속 답변해")); // 또는 "" 등 적절한 프롬프트
                                messageQueue.offer(nextMessages);
                                this.accept(messageQueue.poll());
                            } else {
                                try {
                                    System.out.println("terminated");
                                    if (endStr.get().equals("stop")) {
                                        System.out.println("stop");
                                        emitter.send("data: " + "stop" + "\n\n");
                                    } else{
                                        System.out.println(endStr.get());
                                        emitter.send("data: " + endStr.get() + "\n\n");
                                    }

                                } catch (IOException e) {
                                    emitter.completeWithError(e);
                                } finally {
                                    emitter.complete();
                                }
                            }
                        })
                        .subscribe();
            }
        };

        List<ChatGPTRequest.Message> firstMessages = messageQueue.poll();
        if(firstMessages != null){
            processMessages.accept(firstMessages);
        }
    }

    public String askChatGPT(ClientRequest clientRequest){
        PromptResult promptResult = promptFactory.createPromptResult(clientRequest.getPromptLevel(), clientRequest.getQuestion());

        List<ChatGPTRequest.Message> messages = new ArrayList<>();
        messages.add(new ChatGPTRequest.Message("system", promptResult.getPrompt()));
        messages.add(new ChatGPTRequest.Message("assistant", clientRequest.getPreContent()));
        messages.add(new ChatGPTRequest.Message("user", clientRequest.getQuestion()));

        StringBuilder fullAnswer = new StringBuilder();
        boolean isFinished = false;

        while(!isFinished){
            ChatGPTRequest chatGPTRequest = new ChatGPTRequest(
                    model,
                    messages,
                    promptResult.getMaxTokens(),
                    0.4,
                    false
            );

            long start = System.currentTimeMillis();
            ChatGPTResponse chatGPTResponse = openAiWebClient.post()
                    .uri(apiUrl)
                    .bodyValue(chatGPTRequest)
                    .retrieve()
                    .bodyToMono(ChatGPTResponse.class)
                    .block();

            long elapsed = System.currentTimeMillis() - start;
            System.out.println("GPT 응답 시간: " + elapsed + "ms");

            String answer = chatGPTResponse.getChoices().get(0).getMessage().getContent();
            // "length", "stop", 등
            String finishReason = chatGPTResponse.getChoices().get(0).getFinishReason();

            fullAnswer.append(answer);

            if ("length".equals(finishReason)) {
                // 응답이 잘린 경우 → assistant 응답을 messages에 다시 추가하여 연속 요청
                messages.add(new ChatGPTRequest.Message("assistant", answer));
            } else {
                isFinished = true; // 다 온 경우 반복 종료
            }
        }

        return fullAnswer.toString();
    }

    public String summaryChatGPT(ClientSummaryRequest clientSummaryRequest) {
        PromptResult promptResult = promptFactory.createSummaryPromptResult();


        List<ChatGPTRequest.Message> messages = new ArrayList<>();
        messages.add(new ChatGPTRequest.Message("system", promptResult.getPrompt()));
        messages.add(new ChatGPTRequest.Message("user", clientSummaryRequest.getCoreContent()));

        String summary = sendChatGPT(messages, promptResult);

        return parseSummary(summary);
    }

    private String sendChatGPT(List<ChatGPTRequest.Message> messages, PromptResult promptResult) {
        StringBuilder fullAnswer = new StringBuilder();
        boolean isFinished = false;

        while (!isFinished) {
            ChatGPTRequest chatGPTRequest = new ChatGPTRequest(
                    model,
                    messages,
                    promptResult.getMaxTokens(),
                    promptResult.getTemperature(),
                    false
            );

            long start = System.currentTimeMillis();
            ChatGPTResponse chatGPTResponse = openAiWebClient.post()
                    .uri(apiUrl)
                    .bodyValue(chatGPTRequest)
                    .retrieve()
                    .bodyToMono(ChatGPTResponse.class)
                    .block();

            long elapsed = System.currentTimeMillis() - start;
            System.out.println("GPT 응답 시간: " + elapsed + "ms");

            String answer = chatGPTResponse.getChoices().get(0).getMessage().getContent();
            String finishReason = chatGPTResponse.getChoices().get(0).getFinishReason();

            fullAnswer.append(answer);

            if ("length".equals(finishReason)) {
                messages.add(new ChatGPTRequest.Message("assistant", answer));
                messages.add(new ChatGPTRequest.Message("system", "이어서 계속 요약"));
            } else {
                isFinished = true;
            }
        }

        return fullAnswer.toString();
    }

    public String titleChatGPT(String summary) {
        PromptResult promptResult = promptFactory.createTitlePromptResult();

        ChatGPTRequest chatGPTRequest = new ChatGPTRequest(model, List.of(
                new ChatGPTRequest.Message("system", promptResult.getPrompt()),
                new ChatGPTRequest.Message("user", summary)
        ),
                promptResult.getMaxTokens(),
                0.4,
                false
        );

        long start = System.currentTimeMillis();
        ChatGPTResponse chatGPTResponse = openAiWebClient.post()
                .uri(apiUrl)
                .bodyValue(chatGPTRequest)
                .retrieve()
                .bodyToMono(ChatGPTResponse.class)
                .block();

        long elapsed = System.currentTimeMillis() - start;
        System.out.println("게시글 제목 요약 GPT 응답 시간: " + elapsed + "ms");
        System.out.println("제목  :" + chatGPTResponse.getChoices().get(0).getMessage().getContent());

        return parseTitle(chatGPTResponse.getChoices().get(0).getMessage().getContent());
    }

    public String categoryChatGPT(String title) {
        PromptResult promptResult = promptFactory.createCegoryPromptResult();

        ChatGPTRequest chatGPTRequest = new ChatGPTRequest(model, List.of(
                new ChatGPTRequest.Message("system", promptResult.getPrompt()),
                new ChatGPTRequest.Message("user", title)
        ),
                promptResult.getMaxTokens(),
                0.4,
                false
        );

        long start = System.currentTimeMillis();
        ChatGPTResponse chatGPTResponse = openAiWebClient.post()
                .uri(apiUrl)
                .bodyValue(chatGPTRequest)
                .retrieve()
                .bodyToMono(ChatGPTResponse.class)
                .block();

        long elapsed = System.currentTimeMillis() - start;
        System.out.println("게시글 제목 요약 GPT 응답 시간: " + elapsed + "ms");
        System.out.println("카테고리 :" + chatGPTResponse.getChoices().get(0).getMessage().getContent());

        int categoryId = parseCategory(chatGPTResponse.getChoices().get(0).getMessage().getContent());
        String categoryName = categoryRepository.findById(categoryId).get().getName();

        return categoryName;
    }

    /*OpenAI 답변 파싱*/
    private String parseSummary(String summary){
        if (summary.startsWith("요약:")){
            summary = summary.replace("요약:", "").trim();
        }

        if (summary.startsWith("내용:")){
            summary = summary.replace("내용:", "").trim();
        }
        return summary;
    }

    private String parseTitle(String title){
        //양끝에 ""문자 없애기
        if (title.startsWith("\"") && title.endsWith("\"")) {
            title = title.substring(1, title.length() - 1);
        }

        if (title.startsWith("###")) {
            title = title.replace("###", "").trim();
        }

        if (title.startsWith("제목:")) {
            title = title.replace("제목:", "").trim();
        }
        return title;
    }

    private static final int DEFAULT_CATEGORY_ID = 45; //기타

    private int parseCategory(String category) {
        if (category == null || category.isBlank()) return DEFAULT_CATEGORY_ID;

        try {
            return Integer.parseInt(category.split(" ")[0]);
        } catch (NumberFormatException e) {
            return DEFAULT_CATEGORY_ID;
        }
    }
}
