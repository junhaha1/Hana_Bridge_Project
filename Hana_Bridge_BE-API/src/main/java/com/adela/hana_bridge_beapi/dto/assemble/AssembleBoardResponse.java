package com.adela.hana_bridge_beapi.dto.assemble;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import lombok.Builder;
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
    private LocalDateTime createAt;
    private int likeCount;

    private boolean goodCheck;

    public AssembleBoardResponse(AssembleBoard assembleBoard) {
        this.assembleBoardId = assembleBoard.getAssembleBoardId();
        this.title = assembleBoard.getTitle();
        this.nickName = assembleBoard.getUsers().getNickName();
        this.category = assembleBoard.getCategory();
        this.content = assembleBoard.getContent();
        this.createAt = assembleBoard.getCreateAt();
        this.likeCount = assembleBoard.getLikeCount();
        //초기값
        this.goodCheck = false;
    }
}
