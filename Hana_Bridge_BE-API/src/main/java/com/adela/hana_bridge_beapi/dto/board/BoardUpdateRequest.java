package com.adela.hana_bridge_beapi.dto.board;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class BoardUpdateRequest {
    private String title;
    private String code;
    private String content;
    private LocalDateTime updateAt;
}
