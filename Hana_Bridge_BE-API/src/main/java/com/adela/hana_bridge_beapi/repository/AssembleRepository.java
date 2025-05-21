package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.AssembleBoard;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssembleRepository extends JpaRepository<AssembleBoard, Long> {
    List<AssembleBoard> findByUsers_Id(Long userId);
    List<AssembleBoard> findByAssembleBoardIdIn(List<Long> boardIds);
    List<AssembleBoard> findByUsers_IdOrderByCreateAtDesc(Long userId, Pageable pageable);
    List<AssembleBoard> findAllByOrderByCreateAtDesc();
}
