package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Good {
    @Id
    @Column(name = "good_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long goodId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Users users;

    @ManyToOne
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt;

    @Builder
    public Good(Users users, Board board, LocalDateTime createAt) {
        this.users = users;
        this.board = board;
        this.createAt = createAt;
    }
}
