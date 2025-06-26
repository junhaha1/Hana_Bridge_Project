package com.adela.hana_bridge_beapi.dto.state;

import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class UserDataResponse {
    private String email;
    private String name;
    private String nickName;
    private String role;
    private LocalDateTime createdAt;
    private int totalQuestion;
    private int totalSummary;

    public UserDataResponse(Users user) {
        this.email = user.getEmail();
        this.name = user.getName();
        this.nickName = user.getNickName();
        this.role = user.getRole();
        this.createdAt = user.getCreatedAt();
        this.totalQuestion = user.getTotalQuestion();
        this.totalSummary = user.getTotalSummary();
    }
}
