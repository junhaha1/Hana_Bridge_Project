package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
}
