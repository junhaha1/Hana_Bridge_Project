package com.adela.hana_bridge_beapi.dto.openai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PromptResult {
    private String prompt;
    private int maxTokens;
    private double temperature;
}
