package com.adela.hana_bridge_beapi.dto.state;

import lombok.Getter;

@Getter
public class UserInfoResponse {
    private final String email;
    private final String name;
    private final String nickName;
    private final int totalQuestion;
    private final int totalSummary;
    private final int totalPost;
    private final int totalComment;

    public UserInfoResponse(String email, String name, String nickName,
                            Integer totalQuestion, Integer totalSummary,
                            Long boardCount, Long assembleBoardCount,
                            Long commentCount) {
        this.email = email;
        this.name = name;
        this.nickName = nickName;
        this.totalQuestion = totalQuestion;
        this.totalSummary = totalSummary;
        this.totalPost = (int) (boardCount + assembleBoardCount); // 형 변환
        this.totalComment = commentCount.intValue();
    }
}
