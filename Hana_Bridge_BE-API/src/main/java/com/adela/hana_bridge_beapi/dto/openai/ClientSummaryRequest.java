package com.adela.hana_bridge_beapi.dto.openai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClientSummaryRequest {
    private int promptLevel;
    private String coreContent;
}
