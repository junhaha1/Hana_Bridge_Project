package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Board;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    Page<Board> findByCategory(String category, Pageable pageable);
    Page<Board> findByUsers_Id(Long userId, Pageable pageable);
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
}
