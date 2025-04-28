package com.adela.hana_bridge_beapi.dto.board;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GoodResponse {
    private final Long likeCount;
    private final boolean goodCheck;
}
