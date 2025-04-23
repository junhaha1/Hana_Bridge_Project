package com.adela.hana_bridge_beapi.dto.board;

import com.adela.hana_bridge_beapi.entity.Board;
import lombok.Getter;
import java.time.LocalDate;

@Getter
public class BoardResponse {
    private final Long boardId;
    private final Long userId;
    private final String title;
    private final String category;
    private final String content;
    private final String code;
    private final LocalDate createAt;
    private final LocalDate updateAt;

    public BoardResponse(Board board) {
        this.boardId = board.getBoardId();
        this.userId = board.getUserId();
        this.title = board.getTitle();
        this.category = board.getCategory();
        this.content = board.getContent();
        this.code = board.getCode();
        this.createAt = board.getCreateAt();
        this.updateAt = board.getUpdateAt();
    }
}
