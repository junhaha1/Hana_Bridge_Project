package com.adela.hana_bridge_beapi.dto.state;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TotalDataResponse {
    private long totalArticle; //총 게시글 갯수
    private long codeArticle; //코드 질문 게시글 갯수
    private long noticeArticle; //공지 게시글 갯수
    private long assembleArticle; //AI 답변 게시글 갯수
    private long userCount;
    private long commentCount;
    private long likeCount;
}
