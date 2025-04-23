package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.repository.AssembleRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssembleBoardService {
    private final AssembleRepository assembleRepository;

    //모든 assemble 게시글 조회
    public List<AssembleBoard> findAllAssembleBoards() {
        return assembleRepository.findAll();
    }

    //모든 assemble 게시글 상세 조회
    public AssembleBoard findAssembleBoardById(Long assembleBoardId) {
        return assembleRepository.findById(assembleBoardId)
                .orElseThrow(() -> new IllegalArgumentException("not found: " + assembleBoardId));
    }

    //게시글 ID를 통한 삭제
    public void deleteAssembleBoardById(Long assembleBoardId) {
        if (!assembleRepository.existsById(assembleBoardId)) {
            throw new IllegalArgumentException("게시글이 존재하지 않습니다: " + assembleBoardId);
        }
        assembleRepository.deleteById(assembleBoardId);
    }
}
