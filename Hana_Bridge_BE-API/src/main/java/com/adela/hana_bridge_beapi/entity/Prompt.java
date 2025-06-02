package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Prompt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prompt_id", updatable = false)
    private Long promptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "prompt_name")
    private String name;

    @Column(name = "prompt_role")
    private String role;

    @Column(name = "prompt_form")
    private String form;

    @Column(name = "prompt_level")
    private String level;

    @Column(name = "prompt_option")
    private String option;

    @Builder
    public Prompt(Users users, String name, String role, String form, String level, String option) {
        this.users = users;
        this.name = name;
        this.role = role;
        this.form = form;
        this.level = level;
        this.option = option;
    }

    public void updatePrompt(String newName, String newRole, String newForm, String newLevel, String newOption) {
        this.name = newName;
        this.role = newRole;
        this.form = newForm;
        this.level = newLevel;
        this.option = newOption;
    }
}
