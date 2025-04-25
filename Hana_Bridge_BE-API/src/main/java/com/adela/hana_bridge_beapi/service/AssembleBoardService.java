package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleBoardResponse;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.repository.AssembleRepository;
import jakarta.transaction.Transactional;
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
    @Transactional
    public void deleteAssembleBoardById(String Email, Long assembleBoardId) {
        AssembleBoard assembleBoard = assembleRepository.findById(assembleBoardId)
                .orElseThrow(() -> new IllegalArgumentException("not found assembleBoard : " + assembleBoardId));

        if (!assembleBoard.getUsers().getEmail().equals(Email)) {
            throw new IllegalArgumentException("Board doesn't belong to email : " + Email + ", " + assembleBoardId);
        }

        assembleRepository.deleteById(assembleBoardId);
    }
}
