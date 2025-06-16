package com.adela.hana_bridge_beapi.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserQuestionInfoResponse {
    private int questionCount;
    private int summaryCount;

    public UserQuestionInfoResponse(int questionCount, int summaryCount) {
        this.questionCount = questionCount;
        this.summaryCount = summaryCount;
    }
}
