package com.adela.hana_bridge_beapi.dto.assemble;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.AssembleGood;
import com.adela.hana_bridge_beapi.entity.Users;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class AssembleGoodRequest {
    private LocalDateTime createdAt;
    private Long userId;
    private Long assembleBoardId;

    public AssembleGoodRequest(LocalDateTime createdAt, Long userId, Long assembleBoardId) {
        this.createdAt = createdAt;
        this.userId = userId;
        this.assembleBoardId = assembleBoardId;
    }

    public AssembleGood toEntity(AssembleBoard assembleBoard, Users users) {
        return AssembleGood.builder()
                .createdAt(this.createdAt)
                .assembleBoard(assembleBoard)
                .users(users)
                .build();
    }
}
