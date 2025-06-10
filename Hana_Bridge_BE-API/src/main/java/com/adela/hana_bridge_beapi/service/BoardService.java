package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.dto.board.BoardAddRequest;
import com.adela.hana_bridge_beapi.dto.board.BoardUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.errorhandler.error.BoardNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.CategoryPostNotFoundException;
import com.adela.hana_bridge_beapi.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {
    private final BoardRepository boardRepository;
    final int SIZE = 8; //조회해 오는 게시글 갯수

    //글 전체 조회
    public Page<Board> findByCategory(String category, int page, String sort) {
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<Board> pageBoards = boardRepository.findByCategory(category, pageable);
        if (pageBoards.isEmpty()) {
            throw new CategoryPostNotFoundException(category);
        }
        return pageBoards;
    }

    //해당 사용자의 글 조회
    public Page<Board> findByUserId(Long userId, int page, String sort){
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<Board> boards = boardRepository.findByUsers_Id(userId, pageable);

        return boards;
    }

    //해당 카테고리 게시글에서 검색어가 제목, 내용에 포함되어 있는 게시글 정렬기준으로 정렬하여 조회
    public Page<Board> getSearchBoards(String category, String word, int page, String sort){
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<Board> boards = boardRepository.searchBoardsByCategoryAndWord(category, word, sort, pageable);
        return boards;
    }

    //해당 유저가 작성한 게시글에서 검색어가 제목, 내용에 포함되어 있는 게시글 정렬기준으로 정렬하여 조회
    public Page<Board> getSearchBoards(String category, String word, String sort, Long userId, int page){
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<Board> boards = boardRepository.searchBoardsByCategoryAndWordAndUserId(category, userId, word, sort, pageable);
        return boards;
    }

    //글 상세 조회
    public Board findById(long boardId){
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundException(boardId));
    }

    //글 저장
    @Transactional
    public Board save(BoardAddRequest request){
        return boardRepository.save(request.toEntity());
    }

    //글 수정
    @Transactional
    public Board update(String email, long boardId, BoardUpdateRequest request){
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundException(boardId));
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
                .orElseThrow(() -> new BoardNotFoundException(boardId));
        if (!board.getUsers().getEmail().equals(email)) {
            throw new IllegalArgumentException("Board doesn't belong to email : " + email + ", " + boardId);
        }
        boardRepository.deleteById(boardId);
    }

    /*좋아요 갯수 관련*/
    public Long goodCount(Long boardId){
        return boardRepository.findLikeCountById(boardId);
    }


    //좋아요 수 + 1
    @Transactional
    public void upLikeCount(long boardId){
        boardRepository.incrementLikeCount(boardId);
    }

    //좋아요 수 - 1
    @Transactional
    public void downLikeCount(long boardId){
        boardRepository.decrementLikeCount(boardId);
    }

    /*댓글 갯수 관련*/
    //댓글 수 + 1
    @Transactional
    public void upCommentCount(long boardId){
        boardRepository.incrementCommentCount(boardId);
    }

    //댓글 수 - 1
    @Transactional
    public void downCommentCount(long boardId){
        boardRepository.decrementCommentCount(boardId);
    }
}
