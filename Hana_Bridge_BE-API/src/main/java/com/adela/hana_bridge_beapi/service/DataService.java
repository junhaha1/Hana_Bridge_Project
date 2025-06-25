package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.state.AssembleDataResponse;
import com.adela.hana_bridge_beapi.dto.state.BoardDataResponse;
import com.adela.hana_bridge_beapi.dto.state.TotalDataResponse;
import com.adela.hana_bridge_beapi.dto.state.UserDataResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DataService {
    private final BoardRepository boardRepository;
    private final CommentRepository commentRepository;
    private final AssembleRepository assembleRepository;
    private final UsersRepository usersRepository;
    private final GoodRepository goodRepository;
    private final AssembleGoodRepository assembleGoodRepository;

    public TotalDataResponse getTotalData(){

        long total_article = boardRepository.count() + assembleRepository.count();
        long code_article = boardRepository.countByCategory("code");
        long notice_article = boardRepository.countByCategory("notice");
        long assemble_article = assembleRepository.count();
        long userCount = usersRepository.count();
        long commentCount = commentRepository.count();
        long likeCount = goodRepository.count();

        return new TotalDataResponse(total_article, code_article, notice_article, assemble_article, userCount, commentCount, likeCount);
    }

    public AssembleDataResponse getAssembleData(){
        return new AssembleDataResponse(assembleRepository.count(), assembleGoodRepository.count());
    }

    public BoardDataResponse getData(String category){
        long count = 0;
        /*assemble, board => 서로 분리된 테이블*/
        if (category.equals("assemble")) { //AI 답변일 경우
            count = assembleRepository.count();
        } else { //코드/질문 or 공지일 경우
            count = boardRepository.countByCategory(category);
        }
        return new BoardDataResponse(category, count);
    }

    public UserDataResponse getUserData(){
        long count = usersRepository.count();
        return new UserDataResponse(count);
    }

    public List<Board> getBoardByCategoryWithPeriod(String category, String start, String end){
        LocalDateTime startDate = LocalDateTime.parse(start + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(end + "T23:59:59");
        List<Board> boards = boardRepository.findByCategoryWithCreateAt(category, startDate, endDate);
        return boards;
    }

    public List<AssembleBoard> getAssembleBoardWithPeriod(String start, String end){
        LocalDateTime startDate = LocalDateTime.parse(start + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(end + "T23:59:59");

        List<AssembleBoard> assembleBoards = assembleRepository.findWithCreateAt(startDate, endDate);
        return assembleBoards;
    }
}
