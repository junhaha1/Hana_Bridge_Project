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
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="comment_id", nullable = false)
    private Long commentId;

    @ManyToOne
    @JoinColumn(name="board_id", nullable=false)
    private Board board;

    @ManyToOne
    @JoinColumn(name="user_id", nullable=false)
    private Users users;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt;


    @Builder
    public Comment(Board board, Users users, String content, LocalDateTime createAt) {
        this.board = board;
        this.users = users;
        this.content = content;
        this.createAt = createAt;
    }

    public void update(String content, LocalDateTime createAt) {
        this.content = content;
        this.createAt = createAt;
    }
}
