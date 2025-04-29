package com.adela.hana_bridge_beapi.dto.assemble;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AssembleGoodResponse {
    private final Long likeCount;
    private final boolean goodCheck;
}
