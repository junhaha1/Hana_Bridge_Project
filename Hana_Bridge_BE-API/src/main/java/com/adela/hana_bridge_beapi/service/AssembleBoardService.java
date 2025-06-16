package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleAddRequest;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleSummaryResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.errorhandler.error.AssembleBoardNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.CategoryPostNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.UserEmailNotFoundException;
import com.adela.hana_bridge_beapi.repository.AssembleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssembleBoardService {
    private final AssembleRepository assembleRepository;
    private final int SIZE = 8;

    //모든 assemble 게시글 조회
    public Page<AssembleBoard> findAllAssembleBoards(int page, String sort) {
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }

        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<AssembleBoard> pageBoards = assembleRepository.findAll(pageable);

        return pageBoards;
    }

    //현재 사용자의 글 조회
    public Page<AssembleBoard> findByUserId(Long userId, int page, String sort){
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }

        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<AssembleBoard> assembleBoards = assembleRepository.findByUsers_Id(userId, pageable);
        return assembleBoards;
    }

    //검색어가 제목, 내용에 포함되어 있는 게시글 정렬기준으로 정렬하여 조회
    public Page<AssembleBoard> getSearchAssembleBoards(String word, String sort, int page) {
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }

        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<AssembleBoard> assembleBoards = assembleRepository.searchAssembleBoardsByWord(word, sort, pageable);
        return assembleBoards;
    }

    //오버로딩
    //해당 유저가 작성한 글에서 검색어가 제목, 내용에 포함되어 있는 게시글 정렬기준으로 정렬하여 조회
    public Page<AssembleBoard> getSearchAssembleBoards(String word, String sort, Long userId, int page){
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }

        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<AssembleBoard> assembleBoards = assembleRepository.searchAssembleBoardsByWordAndUserId(word,userId, sort, pageable);
        return assembleBoards;
    }

    //모든 assemble 게시글 상세 조회
    public AssembleBoard findAssembleBoardById(Long assembleBoardId) {
        return assembleRepository.findById(assembleBoardId)
                .orElseThrow(() -> new AssembleBoardNotFoundException(assembleBoardId));
    }

    //게시글 등록
    @Transactional
    public AssembleSummaryResponse save(AssembleAddRequest request){
        AssembleBoard assembleBoard =  assembleRepository.save(request.toEntity());
        AssembleSummaryResponse assembleSummaryResponse = AssembleSummaryResponse.builder()
                .assembleBoardId(assembleBoard.getAssembleBoardId())
                .title(assembleBoard.getTitle())
                .build();
        return assembleSummaryResponse;
    }

    //게시글 ID를 통한 삭제
    @Transactional
    public void deleteAssembleBoardById(String Email, Long assembleBoardId) {
        AssembleBoard assembleBoard = assembleRepository.findById(assembleBoardId)
                .orElseThrow(() -> new AssembleBoardNotFoundException(assembleBoardId));

        if (!assembleBoard.getUsers().getEmail().equals(Email)) {
            throw new UserEmailNotFoundException(Email);
        }

        assembleRepository.deleteById(assembleBoardId);
    }

    /*좋아요 갯수 관련*/
    //해당 게시글의 모든 좋아요 수 조회
    public Long countAssembleBoardGood(Long assembleBoardId) {
        return assembleRepository.findLikeCountById(assembleBoardId);
    }

    //좋아요 수 + 1
    @Transactional
    public void upLikeCount(long assembleBoardId){
        assembleRepository.incrementLikeCount(assembleBoardId);
    }

    //좋아요 수 - 1
    @Transactional
    public void downLikeCount(long assembleBoardId){
        assembleRepository.decrementLikeCount(assembleBoardId);
    }
}
