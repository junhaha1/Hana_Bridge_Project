package com.adela.hana_bridge_beapi.dto.assemble;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AssembleSummaryResponse {
    private Long assembleBoardId;
    private String title;
}
