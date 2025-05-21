package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleAddRequest;
import com.adela.hana_bridge_beapi.dto.assemble.AssembleSummaryResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.errorhandler.error.AssembleBoardNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.UserEmailNotFoundException;
import com.adela.hana_bridge_beapi.repository.AssembleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssembleBoardService {
    private final AssembleRepository assembleRepository;

    //해당 BoardId 값들에 해당하는 board 가져오기
    public List<AssembleBoard> findByBoardIds(List<Long> assembleBoardIds) {
        List<AssembleBoard> assembleBoards = assembleRepository.findByAssembleBoardIdIn(assembleBoardIds);
        return assembleBoards;
    }

    //현재 사용자의 글 조회
    public List<AssembleBoard> findByUserId(Long userId){
        List<AssembleBoard> assembleBoards = assembleRepository.findByUsers_Id(userId);
        return assembleBoards;
    }
    //현재 사용자의 최근 게시글 5개 조회
    public List<AssembleBoard> findRecentByUserId(Long userId){
        PageRequest pageRequest = PageRequest.of(0, 5);
        List<AssembleBoard> assembleBoards = assembleRepository.findByUsers_IdOrderByCreateAtDesc(userId, pageRequest);
        return assembleBoards;
    }

    //모든 assemble 게시글 조회
    public List<AssembleBoard> findAllAssembleBoards() {
        return assembleRepository.findAllByOrderByCreateAtDesc();
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
}
