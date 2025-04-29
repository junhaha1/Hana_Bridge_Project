package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
}
