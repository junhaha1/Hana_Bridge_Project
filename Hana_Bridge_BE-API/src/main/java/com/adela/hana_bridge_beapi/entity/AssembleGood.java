package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "assemblegood")
public class AssembleGood {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assemblegood_id", nullable = false)
    private Long assembleGoodId;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assembleboard_id")
    private AssembleBoard assembleBoard;

    @Builder
    public AssembleGood(LocalDateTime createdAt, Users users, AssembleBoard assembleBoard) {
        this.createdAt = createdAt;
        this.users = users;
        this.assembleBoard = assembleBoard;
    }
}
