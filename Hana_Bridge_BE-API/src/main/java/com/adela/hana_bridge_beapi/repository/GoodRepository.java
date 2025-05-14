package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Good;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GoodRepository extends JpaRepository<Good, Long> {
    //좋아요 개수
    int countByBoard_BoardId(Long BoardId);
    //중복 여부 확인
    boolean existsByBoard_BoardIdAndUsers_Id(Long boardId, Long userId);
    //삭제
    void deleteByBoard_BoardIdAndUsers_Id(Long boardId, Long userId);

    @Query(value = "SELECT board_id FROM good GROUP BY board_id ORDER BY COUNT(*) DESC LIMIT 5", nativeQuery = true)
    List<Long> findTop5BoardIdsByGoodCountNative();
}
