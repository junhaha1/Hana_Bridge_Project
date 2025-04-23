package com.adela.hana_bridge_beapi.dto.comment;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CommentUpdateRequest {
    private String content;
    private LocalDate createAt;
}
