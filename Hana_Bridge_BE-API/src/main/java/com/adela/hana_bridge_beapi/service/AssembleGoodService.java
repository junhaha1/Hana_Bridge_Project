package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.assemble.AssembleGoodRequest;
import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.AssembleGoodRepository;
import com.adela.hana_bridge_beapi.repository.AssembleRepository;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AssembleGoodService {
    private final AssembleGoodRepository assembleGoodRepository;
    private final AssembleRepository assembleRepository;
    private final UsersRepository usersRepository;

    //해당 게시글의 모든 좋아요 수 조회
    public Long findAssembleBoardGood(Long assembleBoardId) {
        return (long) assembleGoodRepository.countByAssembleBoard_AssembleBoardId(assembleBoardId);
    }

    //해당 게시글의 좋아요 등록
    public void registAssembleBoardGood(AssembleGoodRequest request) {
        if (!assembleGoodRepository.existsByAssembleBoard_AssembleBoardIdAndUsers_Id(request.getAssembleBoardId(), request.getUserId())) {

            AssembleBoard assembleBoard = assembleRepository.findById(request.getAssembleBoardId())
                            .orElseThrow(() -> new IllegalArgumentException("Assemble Board Not Found : " + request.getAssembleBoardId()));

            Users users = usersRepository.findById(request.getUserId())
                            .orElseThrow(() -> new IllegalArgumentException("User Not Found : " + request.getUserId()));

            assembleGoodRepository.save(request.toEntity(assembleBoard, users));
        } else {
            throw new IllegalArgumentException("Assemble Board Already Exists : " + request.getUserId());
        }
    }

    //해당 게시글의 좋아요 삭제
    @Transactional
    public void deleteAssembleBoardGood(AssembleGoodRequest request) {
        assembleGoodRepository.deleteByAssembleBoard_AssembleBoardIdAndUsers_Id(request.getAssembleBoardId(), request.getUserId());
    }
}
