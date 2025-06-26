package com.adela.hana_bridge_beapi.dto.state;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class BoardDataResponse {
    String category;
    long count;
}
