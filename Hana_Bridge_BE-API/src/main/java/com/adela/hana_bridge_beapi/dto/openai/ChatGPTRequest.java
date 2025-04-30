package com.adela.hana_bridge_beapi.dto.openai;

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

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
