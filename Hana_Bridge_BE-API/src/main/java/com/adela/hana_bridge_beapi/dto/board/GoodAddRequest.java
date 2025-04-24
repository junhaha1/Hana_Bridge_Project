package com.adela.hana_bridge_beapi.dto.board;

import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Good;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class GoodAddRequest {
    private Long boardId;
    private String userId;

    public Good toEntity(Board board, Users users){
        return Good.builder()
                .users(users)
                .board(board)
                .build();
    }
}
