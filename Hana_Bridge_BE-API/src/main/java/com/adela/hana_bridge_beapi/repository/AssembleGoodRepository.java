package com.adela.hana_bridge_beapi.repository;
import com.adela.hana_bridge_beapi.entity.AssembleGood;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface AssembleGoodRepository extends CrudRepository<AssembleGood, Long> {
    // 게시글 ID로 좋아요 수 조회
    int countByAssembleBoard_AssembleBoardId(Long assembleBoardId);

    // 게시글 ID + 사용자 ID로 좋아요 중복 여부 확인
    boolean existsByAssembleBoard_AssembleBoardIdAndUsers_Id(Long assembleBoardId, Long userId);

    // 게시글 ID + 사용자 ID로 좋아요 삭제
    void deleteByAssembleBoard_AssembleBoardIdAndUsers_Id(Long assembleBoardId, Long userId);

    @Query(value = "SELECT assembleboard_id FROM assemblegood GROUP BY assembleboard_id ORDER BY COUNT(*) DESC LIMIT 5", nativeQuery = true)
    List<Long> findTop5BoardIdsByGoodCountNative();
}

