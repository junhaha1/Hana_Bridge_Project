package com.adela.hana_bridge_beapi.dto.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class BoardUpdateRequest {
    private String title;
    private String code;
    private String content;
    private LocalDate updateAt;
}
