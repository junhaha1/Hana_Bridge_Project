package com.adela.hana_bridge_beapi.dto.comment;

import lombok.Getter;
import com.adela.hana_bridge_beapi.entity.Comment;
import java.time.LocalDate;

@Getter
public class CommentResponse {
    private Long commentId;
    private String content;
    private String nickName;
    private LocalDate createAt;

    public CommentResponse(Comment comment) {
        this.commentId = comment.getCommentId();
        this.content = comment.getContent();
        this.nickName = comment.getUsers().getNickName();
        this.createAt = comment.getCreateAt();
    }
}
