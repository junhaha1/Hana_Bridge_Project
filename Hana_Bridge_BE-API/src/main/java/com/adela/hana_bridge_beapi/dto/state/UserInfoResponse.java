package com.adela.hana_bridge_beapi.dto.state;

import lombok.Getter;

@Getter
public class UserInfoResponse {
    private final String email;
    private final String name;
    private final String nickName;
    private final int totalQuestion;
    private final int totalSummary;
    private final int totalCodeCount;
    private final int totalAssembleCount;
    private final int totalComment;
    private final int receivedLikeCodeCount;
    private final int receivedLikeAssembleCount;

    public UserInfoResponse(String email, String name, String nickName,
                            int totalQuestion, int totalSummary,
                            int boardCount, int assembleBoardCount,
                            int commentCount, int receivedLikeCodeCount, int receivedLikeAssembleCount) {
        this.email = email;
        this.name = name;
        this.nickName = nickName;
        this.totalQuestion = totalQuestion;
        this.totalSummary = totalSummary;
        this.totalCodeCount = boardCount;
        this.totalAssembleCount = assembleBoardCount;
        this.totalComment = commentCount;
        this.receivedLikeCodeCount = receivedLikeCodeCount;
        this.receivedLikeAssembleCount = receivedLikeAssembleCount;
    }
}
