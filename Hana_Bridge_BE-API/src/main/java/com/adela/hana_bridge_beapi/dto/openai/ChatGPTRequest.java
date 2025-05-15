package com.adela.hana_bridge_beapi.dto.openai;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//ChatGPT API에 보내는 요청
public class ChatGPTRequest {
    private String model;
    private List<Message> messages;
    @JsonProperty("max_tokens")
    private int maxTokens;
    @JsonProperty("temperature")
    private double temperature;

    private Boolean stream;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
