package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleGoodAddRequest;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleGoodResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.service.AssembleBoardService;
import com.adela.hana_bridge_beapi.service.AssembleGoodService;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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

    //좋아요 갯수 상위 5개 게시글 가져오기
    @GetMapping("/top")
    public ResponseEntity<List<AssembleBoardResponse>> findTopBoards(){
        List<Long> assembleBoardIds = assembleGoodService.findTop5BoardIds();

        List<AssembleBoardResponse> boards = assembleBoardService.findByBoardIds(assembleBoardIds)
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.countAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        if (boards.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok().body(boards);
    }

    //검색어가 포함 되어 있는 게시글 조회하기
    @GetMapping("/search/{searchWord}/orderBy/{sortType}")
    public ResponseEntity<List<AssembleBoardResponse>> searchAssembleBoards(@PathVariable String searchWord, @PathVariable String sortType) {
        List<AssembleBoardResponse> boards = assembleBoardService.getSearchAssembleBoards(searchWord, sortType)
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.countAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        return ResponseEntity.ok().body(boards);
    }

    @GetMapping("/search/{searchWord}/orderBy/{sortType}/user/{email}")
    public ResponseEntity<List<AssembleBoardResponse>> searchUserAssembleBoards(@PathVariable String searchWord, @PathVariable String sortType, @PathVariable String email) {
        Long userId = usersService.findByEmail(email).getId();

        List<AssembleBoardResponse> boards = assembleBoardService.getSearchAssembleBoards(searchWord, sortType, userId)
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.countAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        return ResponseEntity.ok().body(boards);
    }

    //좋아요순으로 정렬하기
    @GetMapping("/sort/good")
    public ResponseEntity<List<AssembleBoardResponse>> sortGoodAssemble() {
        List<AssembleBoardResponse> boards = assembleBoardService.getAssemblesSortedByLike();
        return ResponseEntity.ok().body(boards);
    }

    //해당 사용자 좋아요순으로 정렬하기
    @GetMapping("/sort/good/user/{email}")
    public ResponseEntity<List<AssembleBoardResponse>> sortGoodUserAssemble(@PathVariable String email) {
        Long userId = usersService.findByEmail(email).getId();
        List<AssembleBoardResponse> boards = assembleBoardService.getAssemblesSortedByLike(userId);
        return ResponseEntity.ok().body(boards);
    }

    //사용자가 작성한 게시글 전체 조회
    @GetMapping("/user/{email}")
    public ResponseEntity<List<AssembleBoardResponse>> findAssembleByEmail(@PathVariable String email){
        Long userId = usersService.findByEmail(email).getId();
        List<AssembleBoardResponse> assembleBoards = assembleBoardService.findByUserId(userId)
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.countAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        return ResponseEntity.ok().body(assembleBoards);
    }

    //사용자가 최근에 작성한 게시글 5개 조회
    @GetMapping("/me/recent")
    public ResponseEntity<List<AssembleBoardResponse>> findRecentAssemblesByMe(@RequestHeader("Authorization") String authHeader){
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        List<AssembleBoardResponse> assembleBoards = assembleBoardService.findRecentByUserId(userId)
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.countAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        return ResponseEntity.ok().body(assembleBoards);
    }


    //게시글 전체 조회
    @GetMapping("")
    public ResponseEntity<List<AssembleBoardResponse>> findAllAssembleBoards() {
        //추후 확장을 위해 assembleBoard를 직접 전달
        List<AssembleBoardResponse> assembleBoardResponses = assembleBoardService.findAllAssembleBoards()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.countAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        return ResponseEntity.ok().body(assembleBoardResponses);
    }

    //게시글 상세 조회
    @GetMapping("/{assembleboard_id}")
    public ResponseEntity<AssembleBoardResponse> findAssembleBoard(@RequestHeader("Authorization") String authHeader, @PathVariable("assembleboard_id") Long assembleBoardId) {

        String accessToken = authHeader.replace("Bearer ", "");
        AssembleBoard assembleBoard = assembleBoardService.findAssembleBoardById(assembleBoardId);

        Long likeCount = assembleGoodService.countAssembleBoardGood(assembleBoardId);

        AssembleBoardResponse detailBoard = new AssembleBoardResponse(assembleBoard, likeCount);

        //게스트가 아니라면 해당 게시글에 좋아요를 눌렀는지 안 눌렀는지 체크
        if (!accessToken.equals("guest")){
            Long usersId = tokenService.findUsersIdByToken(accessToken);
            detailBoard.setGoodCheck(assembleGoodService.checkAssembleBoardGood(assembleBoardId, usersId));
        }
        return ResponseEntity.ok().body(detailBoard);
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
        long likeCount = assembleGoodService.countAssembleBoardGood(assembleBoardId);
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

        return ResponseEntity.ok().body(new AssembleGoodResponse(assembleGoodService.countAssembleBoardGood(request.getAssembleBoardId()), true ));
    }

    //게시글 좋아요 삭제
    //Users 정보를 토큰에서 추출하도록 구현
    @DeleteMapping("/good/{assembleboard_id}")
    public ResponseEntity<AssembleGoodResponse> deleteAssembleBoardGood(@RequestHeader("Authorization") String authHeader, @PathVariable("assembleboard_id") Long assembleBoardId) {
        String accessToken = authHeader.replace("Bearer ", "");
        Long userId = tokenService.findUsersIdByToken(accessToken);

        assembleGoodService.deleteAssembleBoardGood(assembleBoardId, userId);
        return ResponseEntity.ok().body(new AssembleGoodResponse(assembleGoodService.countAssembleBoardGood(assembleBoardId), false ));
    }
}
