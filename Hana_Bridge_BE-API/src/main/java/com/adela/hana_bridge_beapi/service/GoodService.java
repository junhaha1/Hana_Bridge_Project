package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.board.GoodAddRequest;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.errorhandler.error.BoardNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.UserIdNotFoundException;
import com.adela.hana_bridge_beapi.repository.BoardRepository;
import com.adela.hana_bridge_beapi.repository.GoodRepository;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import jakarta.transaction.Transactional;
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
            throw new BoardNotFoundException(boardId);
        }
        return (long) goodRepository.countByBoard_BoardId(boardId);
    }

    public boolean goodCheck(Long boardId, Long userId){
        return goodRepository.existsByBoard_BoardIdAndUsers_Id(boardId, userId);
    }

    @Transactional
    public void goodSave(GoodAddRequest request){
        //중복인 경우 예외처리
        if(goodRepository.existsByBoard_BoardIdAndUsers_Id(request.getBoardId(), request.getUserId())){
            throw new IllegalArgumentException("이미 좋아요를 누른 게시판 입니다. ");
        }
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new BoardNotFoundException(request.getBoardId()));
        Users users = usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new UserIdNotFoundException(request.getUserId()));
        goodRepository.save(request.toEntity(board, users));
    }
    @Transactional
    public void goodRemove(Long boardId, Long userId){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundException(boardId));
        Users users = usersRepository.findById(userId)
                .orElseThrow(() -> new UserIdNotFoundException(userId));

        goodRepository.deleteByBoard_BoardIdAndUsers_Id(boardId, userId);
    }
}
