package com.adela.hana_bridge_beapi.dto.prompt;

import com.adela.hana_bridge_beapi.entity.Prompt;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class PromptRequest {

    Users users;
    String name;
    String role;
    String form;
    String level;
    String option;

    public void connectUserEntity(Users users){
        this.users = users;
    }

    public Prompt toEntity(){
        return Prompt.builder()
                .users(this.users)
                .name(this.name)
                .role(this.role)
                .form(this.form)
                .level(this.level)
                .option(this.option)
                .build();
    }
}
