package com.adela.hana_bridge_beapi.dto.state;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserList {
    public List<UserInfoResponse> users;

    private final long totalPages; //페이지 수
    private final long totalElements; //게시글 전체 갯수
    private final long size; //현재 페이지의 게시글 수
    private final long number; //현재 페이지 번호

    public UserList(List<UserInfoResponse> users, long totalPages, long totalElements, long size, long number) {
        this.users = users;
        this.totalPages = totalPages;
        this.totalElements = totalElements;
        this.size = size;
        this.number = number + 1; //
    }
}
