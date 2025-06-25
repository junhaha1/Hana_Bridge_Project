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
                                if (!"[DONE]".equals(chunk.trim())) {
                                    emitter.send("data: " + chunk  + "\n\n");
                                    // 서버 내부 버퍼에는 content만 누적
                                    JsonNode jsonNode = objectMapper.readTree(chunk);
                                    JsonNode choices = jsonNode.path("choices");
                                    
                                    if (choices.isArray() && choices.size() > 0) {
                                        JsonNode choice = choices.get(0);
                                        String reason = choice.path("finish_reason").asText();
                                        
                                        /*종료 조건 판단*/
                                        if ("stop".equals(reason)) { // 현재 토큰 안에서 답변이 완료된 경우
                                            System.out.println("reason : " + reason);
                                            endStr.set(reason);
                                            return;
                                        } else if ("length".equals(reason)) { //현재 토큰을 다 써서 토큰이 끊긴 경우
                                            System.out.println("reason : " + reason);
                                            endStr.set(reason);
                                            return;
                                        }

                                        JsonNode delta = choice.path("delta");
                                        JsonNode contentNode = delta.path("content");

                                        if (!contentNode.isMissingNode() && !contentNode.isNull()) {
                                            String content = contentNode.asText();
                                            
                                            // 중복 제거 로직 적용 (첫 번째 응답이 아닌 경우에만)
                                            if (buffer.length() > 0) {
                                                content = removeDuplicateContent(buffer.toString(), content);
                                            }
                                            
                                            if (!content.isEmpty()) {
                                                buffer.append(content); // content만 누적
                                            }
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
                            if ("length".equals(endStr.get()) && retryCounter.getAndDecrement() > 0) {
                                System.out.println("continue");
                                List<ChatGPTRequest.Message> nextMessages = new ArrayList<>(messages);
                                nextMessages.add(new ChatGPTRequest.Message("assistant", buffer.toString()));
                                
                                // 마크다운과 문장 구조가 자연스럽게 이어지도록 개선된 프롬프트
                                String continuationPrompt = createContinuationPrompt(buffer.toString());
                                nextMessages.add(new ChatGPTRequest.Message("user", continuationPrompt));
                                
                                messageQueue.offer(nextMessages);
                                this.accept(messageQueue.poll());
                            } else {
                                try {
                                    System.out.println("terminated");
                                    String finalMessage = "stop".equals(endStr.get()) ? "stop" : endStr.get();
                                    System.out.println(finalMessage);
                                    emitter.send("data: " + finalMessage + "\n\n");
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

    /**
     * 답변이 끊어졌을 때 자연스럽게 이어지도록 하는 프롬프트를 생성합니다.
     * 마크다운 형식과 문장 구조를 고려하여 최적화된 프롬프트를 반환합니다.
     */
    private String createContinuationPrompt(String previousContent) {
        if (previousContent == null || previousContent.trim().isEmpty()) {
            return "계속해서 답변을 이어서 작성해주세요.";
        }

        // 마크다운 코드 블록이 열려있는지 확인
        boolean hasOpenCodeBlock = countOccurrences(previousContent, "```") % 2 == 1;
        
        // 마크다운 리스트가 열려있는지 확인
        boolean hasOpenList = hasOpenListItem(previousContent);
        
        // 마크다운 헤더가 끝나지 않았는지 확인
        boolean hasIncompleteHeader = previousContent.trim().endsWith("#");
        
        // 괄호가 열려있는지 확인
        boolean hasOpenParentheses = hasUnclosedParentheses(previousContent);
        
        // 중복 방지를 위한 마지막 단어/구문 분석
        String lastWords = extractLastWords(previousContent);
        
        StringBuilder prompt = new StringBuilder();
        prompt.append("다음 내용을 자연스럽게 이어서 작성해주세요. ");
        
        if (hasOpenCodeBlock) {
            prompt.append("코드 블록이 완료되지 않았으므로 코드를 완성하고 ```로 닫아주세요. ");
        }
        
        if (hasOpenList) {
            prompt.append("리스트 항목이 완료되지 않았으므로 자연스럽게 이어서 작성해주세요. ");
        }
        
        if (hasIncompleteHeader) {
            prompt.append("헤더 제목을 완성해주세요. ");
        }
        
        if (hasOpenParentheses) {
            prompt.append("열린 괄호를 적절히 닫아주세요. ");
        }
        
        // 중복 방지 지시사항 추가
        if (!lastWords.isEmpty()) {
            prompt.append("특히 마지막 부분 '").append(lastWords).append("' 다음부터 자연스럽게 이어서 작성하고, ");
            prompt.append("앞서 언급한 내용을 반복하지 말고 새로운 내용으로 이어가세요. ");
        }
        
        prompt.append("문장의 맥락과 흐름을 유지하면서 자연스럽게 이어서 답변해주세요.");
        
        return prompt.toString();
    }

    /**
     * 이전 내용의 마지막 단어들을 추출하여 중복 방지에 활용합니다.
     */
    private String extractLastWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "";
        }
        
        // 마지막 문장이나 구문을 추출
        String[] sentences = text.split("[.!?]");
        if (sentences.length == 0) {
            return "";
        }
        
        String lastSentence = sentences[sentences.length - 1].trim();
        if (lastSentence.isEmpty()) {
            // 마지막 문장이 비어있으면 그 이전 문장 사용
            if (sentences.length > 1) {
                lastSentence = sentences[sentences.length - 2].trim();
            } else {
                return "";
            }
        }
        
        // 마지막 3-5개 단어를 추출 (너무 길지 않게)
        String[] words = lastSentence.split("\\s+");
        if (words.length <= 3) {
            return lastSentence;
        } else {
            // 마지막 3개 단어만 추출
            StringBuilder result = new StringBuilder();
            for (int i = Math.max(0, words.length - 3); i < words.length; i++) {
                if (result.length() > 0) {
                    result.append(" ");
                }
                result.append(words[i]);
            }
            return result.toString();
        }
    }

    /**
     * 새로운 응답에서 이전 내용과 중복되는 부분을 제거합니다.
     */
    private String removeDuplicateContent(String previousContent, String newContent) {
        if (previousContent == null || newContent == null || 
            previousContent.isEmpty() || newContent.isEmpty()) {
            return newContent;
        }
        
        // 이전 내용의 마지막 부분을 추출
        String lastWords = extractLastWords(previousContent);
        if (lastWords.isEmpty()) {
            return newContent;
        }
        
        // 새로운 내용이 이전 내용으로 시작하는지 확인
        String trimmedNewContent = newContent.trim();
        if (trimmedNewContent.startsWith(lastWords)) {
            // 중복되는 부분 제거
            return trimmedNewContent.substring(lastWords.length()).trim();
        }
        
        // 더 정교한 중복 감지: 마지막 단어들이 연속으로 나타나는 경우
        String[] lastWordArray = lastWords.split("\\s+");
        if (lastWordArray.length > 1) {
            for (int i = lastWordArray.length; i > 0; i--) {
                StringBuilder checkWords = new StringBuilder();
                for (int j = lastWordArray.length - i; j < lastWordArray.length; j++) {
                    if (checkWords.length() > 0) {
                        checkWords.append(" ");
                    }
                    checkWords.append(lastWordArray[j]);
                }
                
                if (trimmedNewContent.startsWith(checkWords.toString())) {
                    return trimmedNewContent.substring(checkWords.length()).trim();
                }
            }
        }
        
        return newContent;
    }

    /**
     * 문자열에서 특정 패턴의 발생 횟수를 계산합니다.
     */
    private int countOccurrences(String text, String pattern) {
        if (text == null || pattern == null) return 0;
        return (text.length() - text.replace(pattern, "").length()) / pattern.length();
    }

    /**
     * 마크다운 리스트 항목이 완료되지 않았는지 확인합니다.
     */
    private boolean hasOpenListItem(String text) {
        if (text == null) return false;
        String[] lines = text.split("\n");
        if (lines.length == 0) return false;
        
        String lastLine = lines[lines.length - 1].trim();
        return lastLine.matches("^[-*+]\\s.*") && !lastLine.endsWith(".") && !lastLine.endsWith("!") && !lastLine.endsWith("?");
    }

    /**
     * 괄호가 열려있는지 확인합니다.
     */
    private boolean hasUnclosedParentheses(String text) {
        if (text == null) return false;
        
        int openCount = countOccurrences(text, "(");
        int closeCount = countOccurrences(text, ")");
        
        return openCount > closeCount;
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
