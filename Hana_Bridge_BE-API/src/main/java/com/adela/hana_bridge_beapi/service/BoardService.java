package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.dto.board.BoardAddRequest;
import com.adela.hana_bridge_beapi.dto.board.BoardUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class BoardService {
    private final BoardRepository boardRepository;

    //글 저장
    public Board save(BoardAddRequest request){
        return boardRepository.save(request.toEntity());
    }

    //글 전체 조회
    public List<Board> findByCategory(String category) {
        List<Board> boards = boardRepository.findByCategory(category);
        if (boards.isEmpty()) {
            throw new IllegalArgumentException("not found category: " + category);
        }
        return boards;
    }

    //글 상세 조회
    public Board findById(long boardId){
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("not found boardId: " + boardId));
    }


    //글 수정
    @Transactional
    public Board update(String email, long boardId, BoardUpdateRequest request){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("not found boardId: " + boardId));
        if (!board.getUsers().getEmail().equals(email)) {
            throw new IllegalArgumentException("Board doesn't belong to email : " + email + ", " + boardId);
        }
        board.update(request.getTitle(), request.getCode(), request.getContent(), request.getUpdateAt());

        return board;
    }

    //글 삭제
    @Transactional
    public void delete(String email, long boardId){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("not found boardId: " + boardId));
        if (!board.getUsers().getEmail().equals(email)) {
            throw new IllegalArgumentException("Board doesn't belong to email : " + email + ", " + boardId);
        }
        boardRepository.deleteById(boardId);
    }
}
