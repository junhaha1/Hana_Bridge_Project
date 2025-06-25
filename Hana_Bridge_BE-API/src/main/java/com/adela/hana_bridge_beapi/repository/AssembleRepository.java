package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AssembleRepository extends JpaRepository<AssembleBoard, Long> {
    Page<AssembleBoard> findByUsers_Id(Long userId, Pageable pageable);
    @Query("""
      SELECT b 
      FROM AssembleBoard b
      WHERE  b.users.id = :userId 
          AND b.categorys = :categorys
    """)
    Page<AssembleBoard> findByUsers_IdAndCategorys(@Param("userId") Long userId, @Param("categorys") Category categorys, Pageable pageable);

    @Query("SELECT b.likeCount FROM AssembleBoard b WHERE b.assembleBoardId = :assembleBoardId")
    Long findLikeCountById(@Param("assembleBoardId") Long assembleBoardId);

    @Modifying
    @Query("UPDATE AssembleBoard b SET b.likeCount = b.likeCount + 1 WHERE b.assembleBoardId = :assembleBoardId")
    void incrementLikeCount(@Param("assembleBoardId") Long assembleBoardId);

    @Modifying
    @Query("UPDATE AssembleBoard b SET b.likeCount = b.likeCount - 1 WHERE b.assembleBoardId = :assembleBoardId")
    void decrementLikeCount(@Param("assembleBoardId") Long assembleBoardId);

    @Query("""
      SELECT b 
      FROM AssembleBoard b
      WHERE b.title LIKE %:word%
      OR b.content LIKE %:word%
      ORDER BY :sort DESC
    """)
    Page<AssembleBoard> searchAssembleBoardsByWord(@Param("word") String word,
                                                   @Param("sort") String sort,
                                                   Pageable pageable);

    @Query("""
      SELECT b 
      FROM AssembleBoard b
      WHERE  b.users.id = :userId
        AND (b.title LIKE %:word% OR b.content LIKE %:word%)
      ORDER BY :sort DESC
    """)
    Page<AssembleBoard> searchAssembleBoardsByWordAndUserId(@Param("word") String word,
                                                            @Param("userId") Long userId,
                                                            @Param("sort") String sort,
                                                            Pageable pageable);

    @Query("""
      SELECT b 
      FROM AssembleBoard b
      WHERE  b.assembleBoardId IN (SELECT g.assembleBoard.assembleBoardId 
                            FROM AssembleGood g 
                            WHERE g.users.id = :userId)
    """)
    Page<AssembleBoard> findAllWithGood(Pageable pageable, @Param("userId") Long userId);

    @Query("""
      SELECT b 
      FROM AssembleBoard b
      WHERE b.categorys = :categorys AND  
          b.assembleBoardId IN (SELECT g.assembleBoard.assembleBoardId 
                            FROM AssembleGood g 
                            WHERE g.users.id = :userId)
    """)
    Page<AssembleBoard> findAllByCategoryWithGood(@Param("categorys") Category categorys, Pageable pageable, @Param("userId") Long userId);

    //하위 카테고리로 조회
    Page<AssembleBoard> findByCategorys(Category categorys, Pageable pageable);

    //상위 카테고리로 조회
    Page<AssembleBoard> findByCategorys_Parent_Id(int parentId, Pageable pageable);

    @Query("""
      SELECT b.categorys.name 
      FROM AssembleBoard b 
      WHERE b.users.id = :userId 
      GROUP BY b.categorys.id, b.categorys.name 
      ORDER BY b.categorys.id
    """)
    List<String> findCategoryByUsers(@Param("userId") Long userId);
}
