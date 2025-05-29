package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Prompt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromptRepository extends JpaRepository<Prompt, Long> {
    List<Prompt> findByUsersId(Long userId);
}
