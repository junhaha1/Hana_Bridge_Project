package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByCategoryOrderByCreateAtDesc(String category);
    List<Board> findByCategoryAndUsers_IdOrderByCreateAtDesc(String category, Long userId);
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
      COUNT(DISTINCT c.comment_id) AS comment_count
    FROM board b
    JOIN users u ON b.user_id = u.id
    LEFT JOIN good g ON b.board_id = g.board_id
    LEFT JOIN comment c ON b.board_id = c.board_id
    WHERE b.category = :category
    GROUP BY b.board_id
    ORDER BY like_count DESC
    """, nativeQuery = true)
    List<Object[]> findBoardsWithAllStats(@Param("category") String category);

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
      COUNT(DISTINCT c.comment_id) AS comment_count
    FROM board b
    JOIN users u ON b.user_id = u.id
    LEFT JOIN good g ON b.board_id = g.board_id
    LEFT JOIN comment c ON b.board_id = c.board_id
    WHERE b.category = "code" AND b.user_id = :userId
    GROUP BY b.board_id
    ORDER BY like_count DESC
    """, nativeQuery = true)
    List<Object[]> findBoardsWithAllStats(@Param("userId") Long userId);

    @Query("SELECT b FROM Board b WHERE b.category = :category AND (b.title LIKE %:word% OR b.content LIKE %:word%) ORDER BY :sort DESC")
    List<Board> searchBoardsByCategoryAndWord(@Param("category") String category, @Param("word") String word, @Param("sort") String sort);

    @Query("""
      SELECT b FROM Board b
      WHERE b.category = :category
        AND b.users.id = :userId
        AND (b.title LIKE %:word% OR b.content LIKE %:word%)
      ORDER BY :sort DESC
    """)
    List<Board> searchBoardsByCategoryAndWordAndUserId(@Param("category") String category, @Param("userId") Long userId, @Param("word") String word, @Param("sort") String sort);
}
