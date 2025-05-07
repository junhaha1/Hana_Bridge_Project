package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.openai.PromptFactory;
import com.adela.hana_bridge_beapi.config.openai.PromptProperties;
import com.adela.hana_bridge_beapi.dto.openai.ChatGPTRequest;
import com.adela.hana_bridge_beapi.dto.openai.ChatGPTResponse;
import com.adela.hana_bridge_beapi.dto.openai.ClientRequest;
import com.adela.hana_bridge_beapi.dto.openai.PromptResult;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenAiService {
    private final WebClient openAiWebClient;
    private final PromptProperties promptProperties;
    private final PromptFactory promptFactory;


    @Value("${openai.model}")
    private String model;

    private final String apiUrl = "/chat/completions";

    public String askChatGPT(ClientRequest clientRequest){
        PromptResult promptResult = promptFactory.createPromptResult(clientRequest.getPromptLevel(), clientRequest.getQuestion());

        List<ChatGPTRequest.Message> messages = new ArrayList<>();
        messages.add(new ChatGPTRequest.Message("system", promptResult.getPrompt()));
        messages.add(new ChatGPTRequest.Message("user", clientRequest.getQuestion()));

        StringBuilder fullAnswer = new StringBuilder();
        boolean isFinished = false;

        while(!isFinished){
            ChatGPTRequest chatGPTRequest = new ChatGPTRequest(
                    model,
                    messages,
                    promptResult.getMaxTokens(),
                    0.4
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

    public String summaryChatGPT(ClientRequest clientRequest) {
        PromptResult promptResult = promptFactory.createSummaryPromptResult(clientRequest.getPromptLevel(), clientRequest.getQuestion());

        List<ChatGPTRequest.Message> messages = new ArrayList<>();
        messages.add(new ChatGPTRequest.Message("system", promptResult.getPrompt()));
        messages.add(new ChatGPTRequest.Message("user", clientRequest.getQuestion()));

        StringBuilder fullAnswer = new StringBuilder();
        boolean isFinished = false;

        while(!isFinished){
            ChatGPTRequest chatGPTRequest = new ChatGPTRequest(
                    model,
                    messages,
                    promptResult.getMaxTokens(),
                    0.4
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

    public String titleChatGPT(String summary) {
        PromptResult promptResult = promptFactory.createTitlePromptResult(summary);

        ChatGPTRequest chatGPTRequest = new ChatGPTRequest(model, List.of(
                new ChatGPTRequest.Message("system", promptResult.getPrompt()),
                new ChatGPTRequest.Message("user", summary)
        ),
                promptResult.getMaxTokens(),
                0.4
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

        return chatGPTResponse.getChoices().get(0).getMessage().getContent();
    }
}
