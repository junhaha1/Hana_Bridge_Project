package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "assembleboard")
public class AssembleBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "assembleboard_id", updatable = false, nullable = false)
    private Long assembleBoardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt;

    @Column(name = "like_count", nullable = false)
    private Long likeCount;

    @Builder
    public AssembleBoard(Users users, String title, String category, String content, LocalDateTime createAt) {
        this.users = users;
        this.title = title;
        this.category = category;
        this.content = content;
        this.createAt = createAt;
    }
}
