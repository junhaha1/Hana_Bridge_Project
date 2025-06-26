package com.adela.hana_bridge_beapi.repository;

import com.adela.hana_bridge_beapi.dto.state.UserInfoResponse;
import com.adela.hana_bridge_beapi.entity.Board;
import com.adela.hana_bridge_beapi.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);

    long countByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);

    @Query("""
    SELECT sum(u.totalQuestion)
    FROM Users u
    """)
    long sumWithTotalQuestion();

    @Query("""
    SELECT sum(u.totalSummary)
    FROM Users u
    """)
    long sumWithTotalSummary();

    List<Users> findByCreatedAtBetween(LocalDateTime createdAtAfter, LocalDateTime createdAtBefore);
}
