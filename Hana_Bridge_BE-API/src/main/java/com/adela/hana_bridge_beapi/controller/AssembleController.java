package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.service.AssembleBoardService;
import com.adela.hana_bridge_beapi.service.AssembleGoodService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/assemble")
@RequiredArgsConstructor
@Tag(name = "ApiV1AssembleController", description = "assemble 게시판에 접근할 경우")
public class AssembleController {
    private final AssembleBoardService assembleBoardService;
    private final AssembleGoodService assembleGoodService;

    //게시글 전체 조회
    @GetMapping("")
    public ResponseEntity<List<AssembleBoardResponse>> findAllAssembleBoards() {
        //추후 확장을 위해 assembleBoard를 직접 전달
        List<AssembleBoardResponse> assembleBoardResponses = assembleBoardService.findAllAssembleBoards()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard, assembleGoodService.findAssembleBoardGood(assembleBoard.getAssembleBoardId())))
                .toList();
        return ResponseEntity.ok().body(assembleBoardResponses);
    }

    //게시글 상세 조회
    @GetMapping("/{assembleboard_id}")
    public ResponseEntity<AssembleBoardResponse> findAssembleBoard(@PathVariable("assembleboard_id") Long assembleBoardId) {
        AssembleBoard assembleBoard = assembleBoardService.findAssembleBoardById(assembleBoardId);

        return ResponseEntity.ok().body(new AssembleBoardResponse(assembleBoard, assembleGoodService.findAssembleBoardGood(assembleBoard.getAssembleBoardId())));
    }

    //게시글 삭제
    @DeleteMapping("/{assembleboard_id}")
    public ResponseEntity<Void> deleteAssembleBoard(@PathVariable("assembleboard_id") Long assembleBoardId) {
        assembleBoardService.deleteAssembleBoardById(assembleBoardId);

        return ResponseEntity.ok().build();
    }

    //-------------게시글 좋아요-------------
    //게시글 좋아요 조회
    @GetMapping("/good/{assembleboard_id}")
    public ResponseEntity<Long> findAssembleBoardGood(@PathVariable("assembleboard_id") Long assembleBoardId) {
        return ResponseEntity.ok().body(assembleGoodService.findAssembleBoardGood(assembleBoardId)); // 수정해야 함.
    }

    //게시글 좋아요 등록
    //Users 정보를 토큰에서 추출하도록 구현
    @PostMapping("/good/{assembleboard_id}")
    public ResponseEntity<Void> registAssembleBoardGood(@PathVariable("assembleboard_id") Long assembleBoardId) {
        //JWT 토큰 생성 후 구현
        return ResponseEntity.ok().build();
    }

    //게시글 좋아요 삭제
    //Users 정보를 토큰에서 추출하도록 구현
    @DeleteMapping("/good/{assembleboard_id}")
    public ResponseEntity<Void> deleteAssembleBoardGood(@PathVariable("assembleboard_id") Long assembleBoardId) {
        //JWT 토큰 생성 후 구현
        return ResponseEntity.ok().build();
    }
}
