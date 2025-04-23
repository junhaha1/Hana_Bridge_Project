package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
