package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.board.BoardAddRequest;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
public class BoardApiController {
    private final BoardService boardService;

    //글 등록
    @PostMapping("/article")
    public ResponseEntity<Board> addBoard(@RequestBody BoardAddRequest request) {
        Board savedBoard = boardService.save(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedBoard);
    }

    //카데고리별 글 전체 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<BoardResponse>> findAllBoard(@PathVariable("category") String category) {
        List<BoardResponse> boards = boardService.findByCategory(category)
                .stream()
                .map(BoardResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok().body(boards);
    }

    //글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> findArticle(@PathVariable("boardId") long boardId){
        Board board = boardService.findById(boardId);
        return ResponseEntity.ok().body(new BoardResponse(board));
    }

    //글 삭제
    @DeleteMapping("/article/{boardId}")
    public ResponseEntity<Void> deleteBoard(@PathVariable("boardId") long boardId){
        boardService.delete(boardId);
        return ResponseEntity.ok()
                .build();
    }

    //글 수정
    @PutMapping("/article/{boardId}")
    public ResponseEntity<Board> updateBoard(@PathVariable("boardId") long boardId, @RequestBody BoardUpdateRequest request){
        Board updateBoard = boardService.update(boardId, request);
        return ResponseEntity.ok()
                .body(updateBoard);
    }
}
