package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findByCategory(String category, Pageable pageable);
    Page<Board> findByUsers_Id(Long userId, Pageable pageable);

    @Query("SELECT b.likeCount FROM Board b WHERE b.boardId = :boardId")
    Long findLikeCountById(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE Board b SET b.likeCount = b.likeCount + 1 WHERE b.boardId = :boardId")
    void incrementLikeCount(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE Board b SET b.likeCount = b.likeCount - 1 WHERE b.boardId = :boardId")
    void decrementLikeCount(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE Board b SET b.commentCount = b.commentCount + 1 WHERE b.boardId = :boardId")
    void incrementCommentCount(@Param("boardId") Long boardId);

    @Modifying
    @Query("UPDATE Board b SET b.commentCount = b.commentCount - 1 WHERE b.boardId = :boardId")
    void decrementCommentCount(@Param("boardId") Long boardId);


    @Query("""
        SELECT b
        FROM Board b
        WHERE b.category = :category
        AND (b.title LIKE %:word% OR b.content LIKE %:word%)
        ORDER BY :sort DESC
    """)
    Page<Board> searchBoardsByCategoryAndWord(@Param("category") String category,
                                              @Param("word") String word,
                                              @Param("sort") String sort,
                                              Pageable pageable);

    @Query("""
      SELECT b FROM Board b
      WHERE b.category = :category
        AND b.users.id = :userId
        AND (b.title LIKE %:word% OR b.content LIKE %:word%)
      ORDER BY :sort DESC
    """)
    Page<Board> searchBoardsByCategoryAndWordAndUserId(@Param("category") String category,
                                                       @Param("userId") Long userId,
                                                       @Param("word") String word,
                                                       @Param("sort") String sort,
                                                       Pageable pageable);

    @Query("""
    SELECT b
    FROM Board b
    WHERE b.category = :category
      AND b.boardId IN (SELECT g.board.boardId
                        FROM Good g
                        WHERE g.users.id = :userId)
    """)
    Page<Board> findByCategoryWithGood(String category, long userId, Pageable pageable);

    @Query("""
    SELECT count(*)
    FROM Board b
    WHERE b.category = :category
    """)
    Long countByCategory(String category);

    @Query("""
    SELECT b
    FROM Board b
    WHERE b.createAt BETWEEN :start AND :end AND b.category = :category
    ORDER BY b.createAt DESC
    """)
    List<Board> findByCategoryWithCreateAt(@Param("category") String category, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    int countByUsers_Id(Long userId);
}
