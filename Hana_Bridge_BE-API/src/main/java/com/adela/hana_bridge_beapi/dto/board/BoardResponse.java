package com.adela.hana_bridge_beapi.dto.board;

import com.adela.hana_bridge_beapi.entity.Board;
import lombok.Builder;
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
    private final int likeCount;
    private final int commentCount;

    private boolean goodCheck; //좋아요 눌렀는지 여부

    public BoardResponse(Board board) {
        this.boardId = board.getBoardId();
        this.nickName = board.getUsers().getNickName();
        this.title = board.getTitle();
        this.category = board.getCategory();
        this.content = board.getContent();
        this.code = board.getCode();
        this.createAt = board.getCreateAt();
        this.updateAt = board.getUpdateAt();
        this.likeCount = board.getLikeCount();
        this.commentCount = board.getCommentCount();

        this.goodCheck = false;
    }
}
