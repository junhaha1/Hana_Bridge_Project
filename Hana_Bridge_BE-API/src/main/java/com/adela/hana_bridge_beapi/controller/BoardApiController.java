package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import com.adela.hana_bridge_beapi.dto.board.*;
import com.adela.hana_bridge_beapi.dto.comment.CommentAddRequest;
import com.adela.hana_bridge_beapi.dto.comment.CommentResponse;
import com.adela.hana_bridge_beapi.dto.comment.CommentUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Comment;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import com.adela.hana_bridge_beapi.service.*;
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
    private final TokenService tokenService;
    private final UsersService usersService;
    private final CommentService commentService;
    private final GoodService goodService;

    //글 등록
    @PostMapping("/article")
    public ResponseEntity<Board> addBoard(@RequestHeader("Authorization") String authHeader,
                                          @RequestBody BoardAddRequest request) {
        String accessToken = authHeader.replace("Bearer ", "");
        String role = tokenService.findRoleByToken(accessToken);
        String email = tokenService.findEmailByToken(accessToken);

        if (request.getCategory().equals("notice") && !role.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            request.connectionUserEntity(usersService.findByEmail(email));
            Board savedBoard = boardService.save(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(savedBoard);
        }
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
    public ResponseEntity<BoardResponse> findArticle(@RequestHeader("Authorization") String authHeader, @PathVariable("boardId") long boardId){
        String accessToken = authHeader.replace("Bearer ", "");
        Board board = boardService.findById(boardId);
        Long likeCount = goodService.goodCount(boardId);

        BoardResponse detailBoard = new BoardResponse(board, likeCount);

        //게스트가 아니라면 해당 게시글에 좋아요를 눌렀는지 안 눌렀는지 체크
        if (!accessToken.equals("guest")){
            Long usersId = tokenService.findUsersIdByToken(accessToken);
            detailBoard.setGoodCheck(goodService.goodCheck(boardId, usersId));
        }

        return ResponseEntity.ok().body(detailBoard);
    }

    //글 삭제
    @DeleteMapping("/article/{boardId}/{category}")
    public ResponseEntity<Void> deleteBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("boardId") long boardId, @PathVariable("category") String category) {
        String accessToken = authHeader.replace("Bearer ", "");
        String role = tokenService.findRoleByToken(accessToken);
        String email = tokenService.findEmailByToken(accessToken);

        if (category.equals("notice") && !role.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            boardService.delete(email, boardId);
            return ResponseEntity.ok()
                    .build();
        }
    }

    //글 수정
    @PutMapping("/article/{boardId}")
    public ResponseEntity<Board> updateBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("boardId") long boardId, @RequestBody BoardUpdateRequest request){
        String accessToken = authHeader.replace("Bearer ", "");
        String role = tokenService.findRoleByToken(accessToken);
        String email = tokenService.findEmailByToken(accessToken);

        if (request.getCategory().equals("notice") && !role.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            Board updateBoard = boardService.update(email, boardId, request);
            return ResponseEntity.ok()
                    .body(updateBoard);
        }
    }


    //--------------------댓글---------------------------
    //댓글 추가
    @PostMapping("/comment/{boardId}")
    public ResponseEntity<Comment> addComment(@RequestHeader("Authorization") String authHeader, @PathVariable Long boardId, @RequestBody CommentAddRequest request) {
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        request.connectionArticle(boardService.findById(boardId));
        request.connectionUserEntity(usersService.findByEmail(email));

        Comment savedComment = commentService.save(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(savedComment);
    }

    //댓글 삭제
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Void> deleteComment(@RequestHeader("Authorization") String authHeader, @PathVariable("commentId") long commentId){
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        commentService.delete(email, commentId);
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
    public ResponseEntity<String> updateComment(@RequestHeader("Authorization") String authHeader, @PathVariable("commentId") long commentId, @RequestBody CommentUpdateRequest request){
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        Comment updateComment = commentService.update(email, commentId, request);
        return ResponseEntity.ok("댓글이 수정되었습니다.");
    }


    //--------------------code  게시판 좋아요 ---------------------------
    //좋아요 생성
    @PostMapping("/good")
    public ResponseEntity<GoodResponse> GoodSave(@RequestHeader("Authorization") String authHeader, @RequestBody GoodAddRequest request){
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        request.setUserId(userId);
        goodService.goodSave(request);

        return ResponseEntity.ok().body(new GoodResponse(goodService.goodCount(request.getBoardId()), true));
    }
    //좋아요 조회
    @GetMapping("/good/{boardId}")
    public ResponseEntity<Long> CountGood(@PathVariable("boardId") long boardId){
        Long likeCount = goodService.goodCount(boardId);
        return ResponseEntity.ok().body(likeCount);
    }
    //좋아요 삭제
    @DeleteMapping("/good/{boardId}")
    public ResponseEntity<GoodResponse> GoodRemove(@RequestHeader("Authorization") String authHeader, @PathVariable Long boardId){
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        goodService.goodRemove(boardId, userId);
        return ResponseEntity.ok().body(new GoodResponse(goodService.goodCount(boardId), false));
    }
}
