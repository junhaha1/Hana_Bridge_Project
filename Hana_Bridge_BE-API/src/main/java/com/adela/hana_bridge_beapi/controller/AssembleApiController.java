package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.*;
import com.adela.hana_bridge_beapi.dto.board.BoardAddRequest;
import com.adela.hana_bridge_beapi.dto.board.BoardList;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.service.AssembleBoardService;
import com.adela.hana_bridge_beapi.service.AssembleGoodService;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assemble")
@RequiredArgsConstructor
@Tag(name = "ApiV1AssembleController", description = "assemble 게시판에 접근할 경우")
public class AssembleApiController {
    private final AssembleBoardService assembleBoardService;
    private final AssembleGoodService assembleGoodService;
    private final TokenService tokenService;
    private final UsersService usersService;

    //사용자가 좋아요 누른 게시글 조회
    @GetMapping("/good/{page}/{sortType}/{category}")
    public ResponseEntity<AssembleBoardList> findByGoodWithBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("page") int page, @PathVariable("sortType") String sortType, @PathVariable String category) {
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        Page<AssembleBoard> boardInfos = assembleBoardService.findWithGood(page, sortType, userId, category);
        List<AssembleBoardResponse> assembleBoardResponses = boardInfos.getContent()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard))
                .toList();
        AssembleBoardList boardList = new AssembleBoardList(assembleBoardResponses, boardInfos.getTotalPages(),
                boardInfos.getTotalElements(), boardInfos.getSize(), boardInfos.getNumber());

        return ResponseEntity.ok().body(boardList);
    }

    //게시글 전체 조회
    @GetMapping("/{page}/{sortType}/{category}")
    public ResponseEntity<AssembleBoardList> findAllAssembleBoards(@PathVariable int page, @PathVariable String sortType, @PathVariable String category) {
        //추후 확장을 위해 assembleBoard를 직접 전달
        Page<AssembleBoard> boardInfos = assembleBoardService.findAllAssembleBoards(page, sortType, category);
        List<AssembleBoardResponse> assembleBoardResponses = boardInfos.getContent()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard))
                .toList();
        AssembleBoardList boardList = new AssembleBoardList(assembleBoardResponses, boardInfos.getTotalPages(),
                boardInfos.getTotalElements(), boardInfos.getSize(), boardInfos.getNumber());

        return ResponseEntity.ok().body(boardList);
    }

    //사용자가 작성한 게시글 전체 조회
    @GetMapping("/user/{page}/{sortType}/{category}")
    public ResponseEntity<AssembleBoardList> findAssembleByEmail(@RequestHeader("Authorization") String authHeader, @PathVariable int page, @PathVariable String sortType, @PathVariable String category) {
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        Page<AssembleBoard> boardInfos = assembleBoardService.findByUserId(userId, page, sortType, category);

        List<AssembleBoardResponse> assembleBoardResponses = boardInfos.getContent()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard))
                .toList();
        AssembleBoardList boardList = new AssembleBoardList(assembleBoardResponses, boardInfos.getTotalPages(),
                boardInfos.getTotalElements(), boardInfos.getSize(), boardInfos.getNumber());

        return ResponseEntity.ok().body(boardList);
    }

    //검색어가 포함 되어 있는 게시글 조회하기
    @GetMapping("/search/{searchWord}/orderBy/{sortType}/{page}")
    public ResponseEntity<AssembleBoardList> searchAssembleBoards(@PathVariable String searchWord, @PathVariable String sortType, @PathVariable int page) {
        Page<AssembleBoard> boardInfos = assembleBoardService.getSearchAssembleBoards(searchWord, sortType, page);

        List<AssembleBoardResponse> assembleBoardResponses = boardInfos.getContent()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard))
                .toList();
        AssembleBoardList boardList = new AssembleBoardList(assembleBoardResponses, boardInfos.getTotalPages(),
                boardInfos.getTotalElements(), boardInfos.getSize(), boardInfos.getNumber());

        return ResponseEntity.ok().body(boardList);
    }

    //검색어가 포함되어 있는 현재 유저 게시글 조회하기
    @GetMapping("/search/{searchWord}/orderBy/{sortType}/user/{page}")
    public ResponseEntity<AssembleBoardList> searchUserAssembleBoards(@RequestHeader("Authorization") String authHeader, @PathVariable String searchWord, @PathVariable String sortType, @PathVariable int page) {
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);
        Page<AssembleBoard> boardInfos = assembleBoardService.getSearchAssembleBoards(searchWord, sortType, userId, page);

        List<AssembleBoardResponse> assembleBoardResponses = boardInfos.getContent()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard))
                .toList();
        AssembleBoardList boardList = new AssembleBoardList(assembleBoardResponses, boardInfos.getTotalPages(),
                boardInfos.getTotalElements(), boardInfos.getSize(), boardInfos.getNumber());

        return ResponseEntity.ok().body(boardList);
    }


    //게시글 상세 조회
    @GetMapping("/{assembleboard_id}")
    public ResponseEntity<AssembleBoardResponse> findAssembleBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("assembleboard_id") Long assembleBoardId) {
        String accessToken = authHeader.replace("Bearer ", "");
        AssembleBoard assembleBoard = assembleBoardService.findAssembleBoardById(assembleBoardId);

        AssembleBoardResponse detailBoard = new AssembleBoardResponse(assembleBoard);

        //게스트가 아니라면 해당 게시글에 좋아요를 눌렀는지 안 눌렀는지 체크
        if (!accessToken.equals("guest")){
            Long usersId = tokenService.findUsersIdByToken(accessToken);
            detailBoard.setGoodCheck(assembleGoodService.checkAssembleBoardGood(assembleBoardId, usersId));
        }
        return ResponseEntity.ok().body(detailBoard);
    }

    @PostMapping("/article")
    public ResponseEntity<AssembleSummaryResponse> addAssembleBoard(@RequestHeader("Authorization") String authHeader,
                                         @RequestBody AssembleAddRequest request) {
        String accessToken = authHeader.replace("Bearer ", "");
        String role = tokenService.findRoleByToken(accessToken);
        String email = tokenService.findEmailByToken(accessToken);

        if (request.getCategory().equals("notice") && !role.equals("ROLE_ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } else {
            request.connectionUserEntity(usersService.findByEmail(email));
            AssembleSummaryResponse assembleSummaryResponse = assembleBoardService.save(request);
            return ResponseEntity.ok().body(assembleSummaryResponse);
        }
    }

    //게시글 삭제
    @DeleteMapping("/{assembleboard_id}")
    public ResponseEntity<Void> deleteAssembleBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("assembleboard_id") Long assembleBoardId) {
        String accessToken = authHeader.replace("Bearer ", "");
        String email = tokenService.findEmailByToken(accessToken);
        assembleBoardService.deleteAssembleBoardById(email, assembleBoardId);

        return ResponseEntity.ok().build();
    }

    //-------------게시글 좋아요-------------
    //게시글 좋아요 조회
    @GetMapping("/good/{assembleboard_id}")
    public ResponseEntity<Long> findAssembleBoardGood(@PathVariable("assembleboard_id") Long assembleBoardId) {
        long likeCount = assembleBoardService.countAssembleBoardGood(assembleBoardId);
        return ResponseEntity.ok().body(likeCount);
    }

    //게시글 좋아요 등록
    //Users 정보를 토큰에서 추출하도록 구현
    @PostMapping("/good")
    public ResponseEntity<AssembleGoodResponse> registAssembleBoardGood(@RequestHeader("Authorization") String authHeader, @RequestBody AssembleGoodAddRequest request) {

        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        request.setUserId(userId);

        assembleGoodService.registAssembleBoardGood(request);
        assembleBoardService.upLikeCount(request.getAssembleBoardId());

        return ResponseEntity.ok().body(new AssembleGoodResponse(assembleBoardService.countAssembleBoardGood(request.getAssembleBoardId()), true ));
    }

    //게시글 좋아요 삭제
    //Users 정보를 토큰에서 추출하도록 구현
    @DeleteMapping("/good/{assembleboard_id}")
    public ResponseEntity<AssembleGoodResponse> deleteAssembleBoardGood(@RequestHeader("Authorization") String authHeader, @PathVariable("assembleboard_id") Long assembleBoardId) {
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        assembleGoodService.deleteAssembleBoardGood(assembleBoardId, userId);
        assembleBoardService.downLikeCount(assembleBoardId);

        return ResponseEntity.ok().body(new AssembleGoodResponse(assembleBoardService.countAssembleBoardGood(assembleBoardId), false ));
    }
}
