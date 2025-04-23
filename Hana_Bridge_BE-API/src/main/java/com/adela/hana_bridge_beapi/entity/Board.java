package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id", updatable = false)
    private Long boardId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "category")
    private String category;

    @Column(name = "code")
    private String code;

    @Column(name = "content")
    private String content;

    @Column(name = "create_at", nullable = false)
    private LocalDate createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDate updateAt;

    @Builder
    public Board(Long userId, String title, String category, String code, String content, LocalDate createAt, LocalDate updateAt) {
        this.userId = userId;
        this.title = title;
        this.category = category;
        this.code = code;
        this.content = content;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    public void update(String title, String code, String content, LocalDate updateAt){
        this.title = title;
        this.code = code;
        this.content = content;
        this.updateAt = updateAt;
    }
}
