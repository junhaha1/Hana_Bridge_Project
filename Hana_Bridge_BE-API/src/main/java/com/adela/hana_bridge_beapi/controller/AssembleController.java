package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.service.AssembleBoardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/assemble")
public class AssembleController {
    private AssembleBoardService assembleBoardService;

    //게시글 전체 조회
    @GetMapping("/")
    public ResponseEntity<List<AssembleBoardResponse>> findAllAssembleBoards() {
        //추후 확장을 위해 assembleBoard를 직접 전달
        List<AssembleBoardResponse> assembleBoardResponses = assembleBoardService.findAllAssembleBoards()
                .stream()
                .map(assembleBoard -> new AssembleBoardResponse(assembleBoard))
                .toList();
        return ResponseEntity.ok().body(assembleBoardResponses);
    }

    //게시글 상세 조회
    @GetMapping("/{assembleboard_id}")
    public ResponseEntity<AssembleBoardResponse> findAssembleBoard(@PathVariable("assembleboard_id") Long assembleBoardId) {
        AssembleBoard assembleBoard = assembleBoardService.findAssembleBoardById(assembleBoardId);

        return ResponseEntity.ok().body(new AssembleBoardResponse(assembleBoard));
    }

    //게시글 삭제
    @DeleteMapping("/{assembleboard_id}")
    public ResponseEntity<Void> deleteAssembleBoard(@PathVariable("assembleboard_id") Long assembleBoardId) {
        assembleBoardService.deleteAssembleBoardById(assembleBoardId);

        return ResponseEntity.ok().build();
    }
}
