package com.adela.hana_bridge_beapi.dto.comment;

import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.entity.Comment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class CommentAddRequest {
    private String content;
    private Board board;
    private Users users;
    private LocalDate createAt;

    public void connectionArticle(Board board){
        this.board = board;
    }
    public void connectionUserEntity(Users users){
        this.users = users;
    }

    public Comment toEntity(){
        return Comment.builder()
                .content(content)
                .board(board)
                .users(users)
                .createAt(createAt)
                .build();
    }
}
