package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.board.GoodAddRequest;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.BoardRepository;
import com.adela.hana_bridge_beapi.repository.GoodRepository;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class GoodService {
    private final GoodRepository goodRepository;
    private final BoardRepository boardRepository;
    private final UsersRepository usersRepository;

    public Long goodCount(Long boardId){
        if (!boardRepository.existsById(boardId)) {
            throw new IllegalArgumentException("Not Founded boardId: " + boardId);
        }
        return (long) goodRepository.countByBoard_BoardId(boardId);
    }

    public void goodSave(GoodAddRequest request){
        //중복인 경우 예외처리
        if(goodRepository.existsByBoard_BoardIdAndUsers_Id(request.getBoardId(), Long.valueOf(request.getUserId()))){
            throw new IllegalArgumentException("이미 좋아요를 누른 게시판 입니다. ");
        }
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new IllegalArgumentException("Not Founded boardId: " + request.getBoardId()));
        Users users = usersRepository.findById(Long.valueOf(request.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("Not Founded user: " + request.getUserId()));
        goodRepository.save(request.toEntity(board, users));
    }

    public void goodRemove(Long boardId, Long userId){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("Not Founded boardId: " + boardId));
        Users users = usersRepository.findById(Long.valueOf(userId))
                .orElseThrow(() -> new IllegalArgumentException("Not Founded user: " + userId));

        goodRepository.deleteByBoard_BoardIdAndUsers_Id(boardId, userId);
    }
}
