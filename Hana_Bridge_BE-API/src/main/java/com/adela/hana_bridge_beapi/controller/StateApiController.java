package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardList;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.dto.state.AssembleDataResponse;
import com.adela.hana_bridge_beapi.dto.state.BoardDataResponse;
import com.adela.hana_bridge_beapi.dto.state.TotalDataResponse;
import com.adela.hana_bridge_beapi.dto.state.UserDataResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.service.BoardService;
import com.adela.hana_bridge_beapi.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/state")
/*게시글 통계 컨트롤러*/
public class StateApiController {

    private final DataService dataService;
    private final BoardService boardService;

    //전체적인 통계 데이터
    @GetMapping("/data/total")
    public ResponseEntity<TotalDataResponse> getTotalData(){
        return ResponseEntity.ok().body(dataService.getTotalData());
    }

    //카테고리별 게시글 갯수 데이터
    @GetMapping("/data")
    public ResponseEntity<BoardDataResponse> getCategoryCount(@RequestParam String category){
        return ResponseEntity.ok().body(dataService.getData(category));
    }

    //카테고리별 게시글 갯수 데이터
    @GetMapping("/data/assemble")
    public ResponseEntity<AssembleDataResponse> getAssembleData(){
        return ResponseEntity.ok().body(dataService.getAssembleData());
    }

    //총 사용자 수
    @GetMapping("/user")
    public ResponseEntity<UserDataResponse> getUserCount(){
        return ResponseEntity.ok().body(dataService.getUserData());
    }

    @GetMapping("/board")
    public ResponseEntity<List<BoardResponse>> getBoardwithPeriod(@RequestParam String category, @RequestParam String start, @RequestParam String end){
        System.out.println(start);
        System.out.println(end);

        List<Board> boards = dataService.getBoardByCategoryWithPeriod(category, start, end);
        List<BoardResponse> boardList = boards
                .stream()
                .map(board -> new BoardResponse(board))
                .toList();
        return ResponseEntity.ok().body(boardList);
    }

    @GetMapping("/board/assemble")
    public ResponseEntity<List<AssembleBoardResponse>> getAssembleBoardwithPeriod(@RequestParam String start, @RequestParam String end){
        System.out.println(start);
        System.out.println(end);

        List<AssembleBoard> boards = dataService.getAssembleBoardWithPeriod(start, end);
        List<AssembleBoardResponse> boardList = boards
                .stream()
                .map(board -> new AssembleBoardResponse(board))
                .toList();
        return ResponseEntity.ok().body(boardList);
    }

}
