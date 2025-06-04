package com.adela.hana_bridge_beapi.dto.prompt;

import com.adela.hana_bridge_beapi.entity.Prompt;
import com.adela.hana_bridge_beapi.entity.Users;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PromptUpdateRequest {
    Long promptId;
    String name;
    String role;
    String form;
    String level;
    String option;
}
