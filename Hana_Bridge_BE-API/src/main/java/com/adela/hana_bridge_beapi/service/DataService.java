package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.state.*;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public UserCountResponse getUserData(){
        long count = usersRepository.count();
        return new UserCountResponse(count);
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

    public TotalUserDataResponse getTotalUserData(){
        long totalUsers = usersRepository.count();

        LocalDateTime startDate = LocalDate.now()
                .withDayOfMonth(1)
                .atStartOfDay();

        LocalDateTime endDate = LocalDate.now()
                .withDayOfMonth(LocalDate.now().lengthOfMonth())
                .atTime(23, 59, 59);

        long monthUsers = usersRepository.countByCreatedAtBetween(startDate, endDate);
        long questionCount = usersRepository.sumWithTotalQuestion();
        long summaryCount = usersRepository.sumWithTotalSummary();
        long assembleArticle = assembleRepository.count();
        long codeArticle = boardRepository.countByCategory("code");
        long commentCount = commentRepository.count();

        return new TotalUserDataResponse(totalUsers, monthUsers, questionCount, summaryCount, assembleArticle, codeArticle, commentCount);
    }

    public List<Users> getUserDataWithPeriod(String start, String end){
        LocalDateTime startDate = LocalDateTime.parse(start + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(end + "T23:59:59");

        List<Users> userList = usersRepository.findByCreatedAtBetween(startDate, endDate);
        return userList;
    }

    public UserInfoResponse getUserInfo(Long userId){
        Users user = usersRepository.findById(userId).orElse(null);
        if(user == null){
            return null;
        }

        int totalCodeCount = boardRepository.countByUsers_Id(userId);
        int totalAssembleCount = assembleRepository.countByUsers_Id(userId);
        int totalComment = commentRepository.countByUsers_Id(userId);
        int receivedLikeCodeCount = goodRepository.countLikesByUserId(userId);
        int receivedLikeAssembleCount = assembleGoodRepository.countLikesByUserId(userId);

        return new UserInfoResponse(user.getEmail(), user.getName(), user.getNickName(),
                user.getTotalQuestion(), user.getTotalSummary(),
                totalCodeCount, totalAssembleCount, totalComment, receivedLikeCodeCount, receivedLikeAssembleCount);
    }

    public List<AssembleBoard> getUserAssembleBoardWithPeriod(Long userId, String start, String end){
        LocalDateTime startDate = LocalDateTime.parse(start + "T00:00:00");
        LocalDateTime endDate = LocalDateTime.parse(end + "T23:59:59");

        List<AssembleBoard> assembleBoards = assembleRepository.findByUsers_IdWithCreateAt(userId, startDate, endDate);
        return assembleBoards;
    }
}
