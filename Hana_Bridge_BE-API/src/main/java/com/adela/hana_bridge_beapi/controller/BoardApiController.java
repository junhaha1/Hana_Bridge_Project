package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.board.BoardAddRequest;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardUpdateRequest;
import com.adela.hana_bridge_beapi.dto.board.GoodAddRequest;
import com.adela.hana_bridge_beapi.dto.comment.CommentAddRequest;
import com.adela.hana_bridge_beapi.dto.comment.CommentResponse;
import com.adela.hana_bridge_beapi.dto.comment.CommentUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Comment;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import com.adela.hana_bridge_beapi.service.BoardService;
import com.adela.hana_bridge_beapi.service.CommentService;
import com.adela.hana_bridge_beapi.service.GoodService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/board")
@Tag(name = "ApiV1BoardController", description = "공지, 코드 게시판에 접근할 경우")
public class BoardApiController {
    private final BoardService boardService;
    private final UsersRepository usersRepository;
    private final CommentService commentService;
    private final GoodService goodService;

    //글 등록
    @PostMapping("/article")
    public ResponseEntity<Board> addBoard(@RequestBody BoardAddRequest request) {
        //userId 하드코딩,,, userId를 저장해야되서,,,,
        //추후에 user == null 경우 예외 처리
        Long userId = 2L;
        request.connectionUserEntity(usersRepository.findById(userId).get());
        Board savedBoard = boardService.save(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedBoard);
    }

    //카데고리별 글 전체 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<BoardResponse>> findAllBoard(@PathVariable("category") String category) {
        List<BoardResponse> boards = boardService.findByCategory(category)
                .stream()
                .map(board -> new BoardResponse(board, goodService.goodCount(board.getBoardId())))
                .toList();
        return ResponseEntity.ok().body(boards);
    }

    //글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> findArticle(@PathVariable("boardId") long boardId){
        Board board = boardService.findById(boardId);
        Long likeCount = goodService.goodCount(boardId);
        return ResponseEntity.ok().body(new BoardResponse(board, likeCount));
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



    //--------------------댓글---------------------------
    //댓글 추가
    @PostMapping("/comment/{boardId}")
    public ResponseEntity<Comment> addComment(@PathVariable Long boardId, @RequestBody CommentAddRequest request) {
        request.connectionArticle(boardService.findById(boardId));

        //추후에 user == null 경우 예외 처리
        //userId 하드코딩,,, userId를 저장해야되서,,,,
        Long userId = 2L;
        request.connectionUserEntity(usersRepository.findById(userId).get());
        Comment savedComment = commentService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedComment);
    }

    //댓글 삭제
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable("commentId") long commentId){
        commentService.delete(commentId);
        return ResponseEntity.ok()
                .build();
    }

    //댓글 조회
    @GetMapping("/comment/{boardId}")
    public ResponseEntity<List<CommentResponse>> findByBoardIdComments(@PathVariable("boardId") long boardId) {
        List<CommentResponse> comments = commentService.findComment(boardId)
                .stream()
                .map(comment -> new CommentResponse(comment))
                .toList();
        return ResponseEntity.ok().body(comments);
    }

    //댓글 수정
    @PutMapping("/comment/{commentId}")
    public ResponseEntity<String> updateComment(@PathVariable("commentId") long commentId, @RequestBody CommentUpdateRequest request){
        Comment updateComment = commentService.update(commentId, request);
        return ResponseEntity.ok("댓글이 수정되었습니다.");
    }


    //--------------------code  게시판 좋아요 ---------------------------
    //좋아요 생성
    @PostMapping("/good/{boardId}")
    public ResponseEntity<String> GoodSave(@PathVariable Long boardId, @RequestBody GoodAddRequest request){
        //JWT사용
        //goodService.goodSave(request);
        return ResponseEntity.ok().build();
    }
    //좋아요 조회
    @GetMapping("/good/{boardId}")
    public ResponseEntity<Long> CountGood(@PathVariable("boardId") long boardId){
        Long likeCount = goodService.goodCount(boardId);
        return ResponseEntity.ok().body(likeCount);
    }
    //좋아요 삭제
    @DeleteMapping("/good/{boardId}")
    public ResponseEntity<String> GoodRemove(@PathVariable Long boardId, @PathVariable Long userId){
        //JWT사용
        //goodService.goodRemove(boardId, userId);
        return ResponseEntity.ok().build();
    }
}
