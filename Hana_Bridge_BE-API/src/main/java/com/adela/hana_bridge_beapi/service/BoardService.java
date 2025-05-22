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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class BoardService {
    private final BoardRepository boardRepository;

    //해당 BoardId 값들에 해당하는 board 가져오기
    public List<Board> findByBoardIds(List<Long> boardIds) {
        List<Board> boards = boardRepository.findByBoardIdIn(boardIds);
        return boards;
    }
    //글 저장
    @Transactional
    public Board save(BoardAddRequest request){
        return boardRepository.save(request.toEntity());
    }

    //해당 사용자의 code 게시글 목록 생성시간 순으로 정렬 조회
    public List<Board> findByUserId(Long userId){
        List<Board> boards = boardRepository.findByCategoryAndUsers_IdOrderByCreateAtDesc("code", userId);
        return boards;
    }

    //좋아요 순으로 게시물 조회
    public List<BoardResponse> getBoardsSortedByLikeWithGoodCheck(String category) {
        List<Object[]> rows = boardRepository.findBoardsWithAllStats(category);

        return rows.stream().map(row -> {
            Long boardId = (Long) row[0];
            String nickname = (String) row[1];
            String title = (String) row[2];
            String cate = (String) row[3];
            String code = row[4] == null ? "" : (String) row[4];
            String content = (String) row[5];
            LocalDateTime createAt = ((Timestamp) row[6]).toLocalDateTime();
            LocalDateTime updateAt = ((Timestamp) row[7]).toLocalDateTime();
            Long likeCount = (Long) row[8];
            Long commentCount = (Long) row[9];

            return BoardResponse.builder()
                    .boardId(boardId)
                    .nickName(nickname)
                    .title(title)
                    .code(code)
                    .category(cate)
                    .content(content)
                    .createAt(createAt)
                    .updateAt(updateAt)
                    .goodCheck(false)
                    .likeCount(likeCount)
                    .commentCount(commentCount)
                    .build();
        }).collect(Collectors.toList());
    }

    //해당 사용자가 작성한 게시글 좋아요순으로 정렬조회
    public List<BoardResponse> getMyCodeBoardsSortedByLike(Long userId) {
        List<Object[]> rows = boardRepository.findBoardsWithAllStats(userId);

        return rows.stream().map(row -> {
            Long boardId = (Long) row[0];
            String nickname = (String) row[1];
            String title = (String) row[2];
            String cate = (String) row[3];
            String code = row[4] == null ? "" : (String) row[4];
            String content = (String) row[5];
            LocalDateTime createAt = ((Timestamp) row[6]).toLocalDateTime();
            LocalDateTime updateAt = ((Timestamp) row[7]).toLocalDateTime();
            Long likeCount = (Long) row[8];
            Long commentCount = (Long) row[9];

            return BoardResponse.builder()
                    .boardId(boardId)
                    .nickName(nickname)
                    .title(title)
                    .code(code)
                    .category(cate)
                    .content(content)
                    .createAt(createAt)
                    .updateAt(updateAt)
                    .goodCheck(false)
                    .likeCount(likeCount)
                    .commentCount(commentCount)
                    .build();
        }).collect(Collectors.toList());
    }


    //글 전체 조회
    public List<Board> findByCategory(String category) {
        List<Board> boards = boardRepository.findByCategoryOrderByCreateAtDesc(category);
        if (boards.isEmpty()) {
            throw new CategoryPostNotFoundException(category);
        }
        return boards;
    }

    //글 상세 조회
    public Board findById(long boardId){
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new BoardNotFoundException(boardId));
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
}
