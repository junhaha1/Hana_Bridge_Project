package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.dto.state.*;
import com.adela.hana_bridge_beapi.dto.state.UserList;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.service.BoardService;
import com.adela.hana_bridge_beapi.service.DataService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UserCountResponse> getUserCount(){
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

    //사용자에 대한 전체적인 통계
    @GetMapping("/user/total")
    public ResponseEntity<TotalUserDataResponse> getTotalUserData(){
        return ResponseEntity.ok().body(dataService.getTotalUserData());
    }

    //해당 기간 동안 신규 가입한 유저 수 반환
    @GetMapping("/user/period")
    public ResponseEntity<List<UserDataResponse>> getUserPeriod(@RequestParam String start, @RequestParam String end){
        List<Users> users = dataService.getUserDataWithPeriod(start, end);
        List<UserDataResponse> userList = users
                .stream()
                .map(user -> new UserDataResponse(user))
                .toList();
        return ResponseEntity.ok().body(userList);
    }
}
