package com.adela.hana_bridge_beapi.dto.board;

import com.adela.hana_bridge_beapi.entity.Board;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class BoardResponse {
    private final Long boardId;
    private final String nickName;
    private final String title;
    private final String category;
    private final String content;
    private final String code;
    private final LocalDateTime createAt;
    private final LocalDateTime updateAt;

    private final Long likeCount;
    private final Long commentCount;

    private boolean goodCheck;

    public BoardResponse(Board board, Long likeCount, Long commentCount) {
        this.boardId = board.getBoardId();
        this.nickName = board.getUsers().getNickName();
        this.title = board.getTitle();
        this.category = board.getCategory();
        this.content = board.getContent();
        this.code = board.getCode();
        this.createAt = board.getCreateAt();
        this.updateAt = board.getUpdateAt();

        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.goodCheck = false;
    }
}
