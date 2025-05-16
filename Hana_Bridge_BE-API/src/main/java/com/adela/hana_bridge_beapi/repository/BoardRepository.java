package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByCategory(String category);
    List<Board> findByCategoryOrderByCreateAtDesc(String category);
    List<Board> findByCategoryAndUsers_Id(String category, Long userId);
    List<Board> findByBoardIdIn(List<Long> boardIds);
}
