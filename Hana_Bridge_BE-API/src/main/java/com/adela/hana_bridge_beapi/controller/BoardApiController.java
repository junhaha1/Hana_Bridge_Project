package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.dto.board.*;
import com.adela.hana_bridge_beapi.dto.comment.CommentAddRequest;
import com.adela.hana_bridge_beapi.dto.comment.CommentResponse;
import com.adela.hana_bridge_beapi.dto.comment.CommentUpdateRequest;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Comment;
import com.adela.hana_bridge_beapi.service.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    //카데고리별 글 전체 조회 -> sortType으로 정렬 조건 변경 가능
    @GetMapping("/category/{category}/{page}/{sortType}")
    public ResponseEntity<BoardList> findAllBoard(@PathVariable("category") String category, @PathVariable("page") int page, @PathVariable("sortType") String sortType) {
        Page<Board> boards = boardService.findByCategory(category, page, sortType);
        List<BoardResponse> boardInfos = boards.getContent()
                .stream()
                .map(board -> new BoardResponse(board))
                .toList();

        BoardList boardList = new BoardList(boardInfos, boards.getTotalPages(), boards.getTotalElements(), boards.getSize(), boards.getNumber());
        return ResponseEntity.ok().body(boardList);
    }

    //현재 사용자가 작성한 글 목록 가져오기 -> sortType으로 정렬 조건 변경 가능
    @GetMapping("/user/{email}/{page}/{sortType}")
    public ResponseEntity<BoardList> findBoardByEmail(@PathVariable String email, @PathVariable("page") int page, @PathVariable("sortType") String sortType) {
        Long userId = usersService.findByEmail(email).getId();

        Page<Board> boards = boardService.findByUserId(userId, page, sortType);

        List<BoardResponse> boardInfos = boards.getContent()
                .stream()
                .map(board -> new BoardResponse(board))
                .toList();

        BoardList boardList = new BoardList(boardInfos, boards.getTotalPages(), boards.getTotalElements(), boards.getSize(), boards.getNumber());
        return ResponseEntity.ok().body(boardList);
    }

    //검색어가 포함되어 있는 게시글 조회
    @GetMapping("/category/{category}/search/{searchWord}/orderBy/{sortType}/{page}")
    public ResponseEntity<BoardList> searchBoards(@PathVariable String category, @PathVariable int page, @PathVariable String searchWord, @PathVariable String sortType) {
        Page<Board> boards = boardService.getSearchBoards(category, searchWord, page, sortType);
        List<BoardResponse> boardInfos = boards.getContent()
                .stream()
                .map(board -> new BoardResponse(board))
                .toList();

        BoardList boardList = new BoardList(boardInfos, boards.getTotalPages(), boards.getTotalElements(), boards.getSize(), boards.getNumber());
        return ResponseEntity.ok().body(boardList);
    }

    //검색어가 포함되어 있는 사용자 게시글 조회
    @GetMapping("/category/{category}/search/{searchWord}/orderBy/{sortType}/user/{email}/{page}")
    public ResponseEntity<BoardList> searchUserCodeBoards(@PathVariable String category, @PathVariable String searchWord, @PathVariable String sortType, @PathVariable String email, @PathVariable int page) {
        Long userId = usersService.findByEmail(email).getId();
        Page<Board> boards = boardService.getSearchBoards(category, searchWord, sortType, userId, page);

        List<BoardResponse> boardInfos = boards.getContent()
                .stream()
                .map(board -> new BoardResponse(board))
                .toList();

        BoardList boardList = new BoardList(boardInfos, boards.getTotalPages(), boards.getTotalElements(), boards.getSize(), boards.getNumber());
        return ResponseEntity.ok().body(boardList);
    }

    //글 등록
    @PostMapping("/article")
    public ResponseEntity<Long> addBoard(@RequestHeader("Authorization") String authHeader,
                                          @RequestBody BoardAddRequest request) {
        String accessToken = authHeader.replace("Bearer ", "");
        String role = tokenService.findRoleByToken(accessToken);
        String email = tokenService.findEmailByToken(accessToken);

        if (request.getCategory().equals("notice") && !role.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            request.connectionUserEntity(usersService.findByEmail(email));
            Long boardId = boardService.save(request).getBoardId();
            return ResponseEntity.ok().body(boardId);
        }
    }

    //글 상세 조회
    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> findBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("boardId") long boardId){
        String accessToken = authHeader.replace("Bearer ", "");
        Board board = boardService.findById(boardId);
        BoardResponse detailBoard = new BoardResponse(board);

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
            boardService.update(email, boardId, request);
            return ResponseEntity.ok()
                    .build();
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

        commentService.save(request);
        boardService.upCommentCount(boardId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    //댓글 삭제
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Void> deleteComment(@RequestHeader("Authorization") String authHeader, @PathVariable("commentId") long commentId){
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        commentService.delete(email, commentId);
        boardService.downCommentCount(commentId);

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
    //댓글 갯수 조회
    @GetMapping("/comment/{boardId}/summary")
    public ResponseEntity<Long> countCommentsByBoardId(@PathVariable("boardId") long boardId) {
        return ResponseEntity.ok().body(commentService.countComment(boardId));
    }

    //댓글 수정
    @PutMapping("/comment/{commentId}")
    public ResponseEntity<String> updateComment(@RequestHeader("Authorization") String authHeader, @PathVariable("commentId") long commentId, @RequestBody CommentUpdateRequest request){
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);

        commentService.update(email, commentId, request);
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
        boardService.upLikeCount(request.getBoardId());

        return ResponseEntity.ok().body(new GoodResponse(boardService.goodCount(request.getBoardId()), true));
    }
    //좋아요 조회
    @GetMapping("/good/{boardId}")
    public ResponseEntity<Long> CountGood(@PathVariable("boardId") long boardId){
        Long likeCount = boardService.goodCount(boardId);
        return ResponseEntity.ok().body(likeCount);
    }
    //좋아요 삭제
    @DeleteMapping("/good/{boardId}")
    public ResponseEntity<GoodResponse> GoodRemove(@RequestHeader("Authorization") String authHeader, @PathVariable Long boardId){
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        goodService.goodRemove(boardId, userId);
        boardService.downLikeCount(boardId);

        return ResponseEntity.ok().body(new GoodResponse(boardService.goodCount(boardId), false));
    }
}
