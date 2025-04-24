package com.adela.hana_bridge_beapi.dto.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {
    private String email;
    private String name;
    private String nickname;
    private String role;
    private String accessToken;

    @Builder
    public UserResponse(String email, String name, String nickname, String role, String accessToken) {
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.role = role;
        this.accessToken = accessToken;
    }
}
