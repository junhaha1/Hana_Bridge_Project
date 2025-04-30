package com.adela.hana_bridge_beapi.dto.openai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
//클라이언트에 응답할 답변
public class ClientResponse {
    private String answer;
}
