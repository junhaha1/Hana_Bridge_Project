package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Good;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GoodRepository extends JpaRepository<Good, Long> {
    //좋아요 개수
    int countByBoard_BoardId(Long BoardId);
    //중복 여부 확인
    boolean existsByBoard_BoardIdAndUsers_Id(Long boardId, Long userId);
    //삭제
    void deleteByBoard_BoardIdAndUsers_Id(Long boardId, Long userId);
}
