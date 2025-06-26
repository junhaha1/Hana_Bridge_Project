package com.adela.hana_bridge_beapi.dto.state;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TotalUserDataResponse {
    private long totalUsers;
    private long monthUsers;
    private long questionCount;
    private long summaryCount;
    private long assembleArticle;
    private long codeArticle;
    private long commentCount;
}
