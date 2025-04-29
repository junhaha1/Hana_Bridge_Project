package com.adela.hana_bridge_beapi.dto.assemble;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Users;
import jakarta.persistence.Column;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AssembleBoardResponse {
    private Long assembleBoardId;
    private String nickName;
    private String title;
    private String category;
    private String content;
    private LocalDateTime createdAt;

    private Long goodCount;
    private boolean goodCheck;

    public AssembleBoardResponse(AssembleBoard assembleBoard, Long goodCount ) {
        this.assembleBoardId = assembleBoard.getAssembleBoardId();
        this.title = assembleBoard.getTitle();
        this.nickName = assembleBoard.getUsers().getNickName();
        this.category = assembleBoard.getCategory();
        this.content = assembleBoard.getContent();
        this.createdAt = assembleBoard.getCreatedAt();

        this.goodCount = goodCount;
        //초기값
        this.goodCheck = false;
    }
}
