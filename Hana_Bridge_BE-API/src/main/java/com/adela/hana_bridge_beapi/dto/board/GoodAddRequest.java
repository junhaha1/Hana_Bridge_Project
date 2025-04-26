package com.adela.hana_bridge_beapi.dto.board;

import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Good;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GoodAddRequest {
    private Long boardId;
    private Long userId;

    public Good toEntity(Board board, Users users){
        return Good.builder()
                .users(users)
                .board(board)
                .createAt(LocalDateTime.now())
                .build();
    }
}
