package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleAddRequest;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleSummaryResponse;
import com.adela.hana_bridge_beapi.dto.board.BoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Category;
import com.adela.hana_bridge_beapi.errorhandler.error.AssembleBoardNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.CategoryPostNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.UserEmailNotFoundException;
import com.adela.hana_bridge_beapi.repository.AssembleRepository;
import com.adela.hana_bridge_beapi.repository.CategoryRepository;
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
    private final CategoryRepository categoryRepository;

    //사용자가 좋아요를 누른 assemble 게시글 조회
    public Page<AssembleBoard> findWithGood(int page, String sort, long userId, String category) {
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());
        Page<AssembleBoard> pageBoards = null;

        if (category.equals("all")) { //전체 조회일 경우
            pageBoards = assembleRepository.findAllWithGood(pageable, userId);
        } else { //특정 카테고리일 경우
            Category categorys = categoryRepository.findByName(category)
                    .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다."));

            pageBoards = assembleRepository.findAllByCategoryWithGood(categorys, pageable, userId);
        }

        return pageBoards;
    }

    //모든 assemble 게시글 조회
    public Page<AssembleBoard> findAllAssembleBoards(int page, String sort, String category) {
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        //페이지 설정
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<AssembleBoard> pageBoards = null;
        if (category.equals("all")) { //전체 조회일 경우
            pageBoards = assembleRepository.findAll(pageable);
        } else { //특정 카테고리일 경우
            Category categorys = categoryRepository.findByName(category)
                    .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다."));

            if(categorys.getParent() != null) { //하위 카테고리로 조회
                pageBoards = assembleRepository.findByCategorys(categorys, pageable);
            } else { //상위 카테고리로 조회
                pageBoards = assembleRepository.findByCategorys_Parent_Id(categorys.getId(), pageable);
            }
        }
        return pageBoards;
    }

    //현재 사용자의 글 조회
    public Page<AssembleBoard> findByUserId(Long userId, int page, String sort, String category) {
        if (sort.equals("latest")) {
            sort = "createAt";
        } else {
            sort = "likeCount";
        }
        Pageable pageable = PageRequest.of(page - 1, SIZE, Sort.by(sort).descending());

        Page<AssembleBoard> assembleBoards = null;
        if (category.equals("all")) { //전체 조회일 경우
            assembleBoards = assembleRepository.findByUsers_Id(userId, pageable);
        } else { //특정 카테고리일 경우
            Category categorys = categoryRepository.findByName(category)
                    .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다."));

            assembleBoards = assembleRepository.findByUsers_IdAndCategorys(userId, categorys, pageable);
        }


        return assembleBoards;
    }

    //사용자가 작성한 게시글의 카테고리 목록 조회
    public List<String> getUserCategories(Long userId) {
        return assembleRepository.findCategoryByUsers(userId);
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
        Category categorys = categoryRepository.findByName(request.getCategoryName())
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리가 없습니다."));

        AssembleBoard assembleBoard =  assembleRepository.save(request.toEntity(categorys));
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
