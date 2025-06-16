package com.adela.hana_bridge_beapi.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String email;
    private String name;
    private String nickName;
    private String role;
    private String accessToken;
    private int questionCount;
    private int summaryCount;

    @Builder
    public UserResponse(String email, String name, String nickName, String role, String accessToken, int questionCount, int summaryCount) {
        this.email = email;
        this.name = name;
        this.nickName = nickName;
        this.role = role;
        this.accessToken = accessToken;
        this.questionCount = questionCount;
        this.summaryCount = summaryCount;
    }
}
