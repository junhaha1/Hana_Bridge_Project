package com.adela.hana_bridge_beapi.dto.assemble;

import com.adela.hana_bridge_beapi.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AssembleGoodAddRequest {
    private Long assembleBoardId;
    private Long userId;

    public AssembleGood toEntity(AssembleBoard assembleBoard, Users users){
        return AssembleGood.builder()
                .users(users)
                .assembleBoard(assembleBoard)
                .createdAt(LocalDateTime.now())
                .build();
    }
}
