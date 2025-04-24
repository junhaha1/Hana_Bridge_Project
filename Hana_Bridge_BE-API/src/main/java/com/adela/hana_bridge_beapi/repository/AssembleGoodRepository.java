package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.AssembleGood;
import org.springframework.data.repository.CrudRepository;

public interface AssembleGoodRepository extends CrudRepository<AssembleGood, Long> {
    // 게시글 ID로 좋아요 수 조회
    int countByAssembleBoardId_Id(Long assembleBoardId);

    // 게시글 ID + 사용자 ID로 좋아요 중복 여부 확인
    boolean existsByAssembleBoardId_IdAndUser_Id(Long assembleBoardId, Long userId);

    void deleteByAssembleBoardIdAndUser_Id(Long assembleBoardId, Long userId);
}
