package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.openai.PromptConfig;
import com.adela.hana_bridge_beapi.dto.openai.ChatGPTRequest;
import com.adela.hana_bridge_beapi.dto.openai.ChatGPTResponse;
import com.adela.hana_bridge_beapi.dto.openai.ClientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OpenAiService {
    private final WebClient openAiWebClient;
    private final PromptConfig promptConfig;

    @Value("${openai.model}")
    private String model;

    private final String apiUrl = "/chat/completions";

    public String askChatGPT(ClientRequest clientRequest){
        String systemPrompt = promptConfig.getPrompts()
                .getOrDefault(clientRequest.getPromptLevel(), "명확하고 친절하게 설명해줘.");

        ChatGPTRequest chatGPTRequest = new ChatGPTRequest(model, List.of(
                new ChatGPTRequest.Message("system", systemPrompt),
                new ChatGPTRequest.Message("user", clientRequest.getQuestion())
        ),
        300
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
