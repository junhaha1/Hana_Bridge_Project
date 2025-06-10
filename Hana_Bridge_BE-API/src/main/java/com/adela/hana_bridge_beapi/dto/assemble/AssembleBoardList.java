package com.adela.hana_bridge_beapi.dto.assemble;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AssembleBoardList {

    List<AssembleBoardResponse> assembleBoards;
    private final long totalPages; //페이지 수
    private final long totalElements; //게시글 전체 갯수
    private final long size; //현재 페이지의 게시글 수
    private final long number; //현재 페이지 번호

    public AssembleBoardList(List<AssembleBoardResponse> assembleBoards,long totalPages, long totalElements, long size, long number) {
        this.assembleBoards = assembleBoards;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.size = size;
        this.number = number;
    }
}
