package com.adela.hana_bridge_beapi.dto.prompt;

import lombok.*;

@Setter
@Getter
public class PromptResponse {
    Long promptId;
    String name;
    String role;
    String form;
    String level;
    String option;

    @Builder
    public PromptResponse(Long promptId, String name, String role, String form, String level, String option) {
        this.promptId = promptId;
        this.name = name;
        this.role = role;
        this.form = form;
        this.level = level;
    }
}
