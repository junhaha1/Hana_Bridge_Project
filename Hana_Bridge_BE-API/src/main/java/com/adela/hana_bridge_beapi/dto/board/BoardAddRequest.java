package com.adela.hana_bridge_beapi.dto.board;

import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class BoardAddRequest {
    private Users users;
    private String title;
    private String category;
    private String code;
    private String content;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    public void connectionUserEntity(Users users){
        this.users = users;
    }

    public Board toEntity(){
        return Board.builder()
                .users(users)
                .title(title)
                .category(category)
                .code(code)
                .content(content)
                .createAt(createAt)
                .updateAt(updateAt)
                .build();
    }
}
