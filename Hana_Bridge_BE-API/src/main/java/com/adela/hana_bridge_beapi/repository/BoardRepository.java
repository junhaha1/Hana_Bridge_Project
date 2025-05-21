package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByCategory(String category);
    List<Board> findByCategoryOrderByCreateAtDesc(String category);
    List<Board> findByCategoryAndUsers_Id(String category, Long userId);
    List<Board> findByBoardIdIn(List<Long> boardIds);

    @Query(value = """
    SELECT 
      b.board_id,
      u.nickname AS nickname,
      b.title,
      b.category,
      b.code,
      b.content,
      b.create_at,
      b.update_at,
      COUNT(DISTINCT g.good_id) AS like_count,
      COUNT(DISTINCT c.comment_id) AS comment_count,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM good g2 
          WHERE g2.board_id = b.board_id AND g2.user_id = :userId
        ) THEN TRUE 
        ELSE FALSE 
      END AS good_check
    FROM board b
    JOIN users u ON b.user_id = u.id
    LEFT JOIN good g ON b.board_id = g.board_id
    LEFT JOIN comment c ON b.board_id = c.board_id
    WHERE b.category = :category
    GROUP BY b.board_id
    ORDER BY like_count DESC
    """, nativeQuery = true)
    List<Object[]> findBoardsWithAllStats(@Param("category") String category, @Param("userId") Long userId);
}
