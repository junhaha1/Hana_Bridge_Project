package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssembleRepository extends JpaRepository<AssembleBoard, Long> {
    List<AssembleBoard> findByUsers_Id(Long userId);
    List<AssembleBoard> findByAssembleBoardIdIn(List<Long> boardIds);
    List<AssembleBoard> findByUsers_IdOrderByCreateAtDesc(Long userId, Pageable pageable);
    List<AssembleBoard> findAllByOrderByCreateAtDesc();

    @Query(value = """
    SELECT 
      b.assembleboard_id,
      u.nickname AS nickname,
      b.title,
      b.content,
      b.create_at,
      COUNT(DISTINCT g.assemblegood_id) AS like_count
    FROM assembleboard b
    JOIN users u ON b.user_id = u.id
    LEFT JOIN assemblegood g ON b.assembleboard_id = g.assembleboard_id
    GROUP BY b.assembleboard_id
    ORDER BY like_count DESC
    """, nativeQuery = true)
    List<Object[]> findAssembleBoardsWithAllStats();
}
