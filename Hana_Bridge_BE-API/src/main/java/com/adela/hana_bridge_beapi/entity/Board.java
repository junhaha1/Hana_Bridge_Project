package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "board_id", updatable = false)
    private Long boardId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "category")
    private String category;

    @Column(name = "code")
    private String code;

    @Column(name = "content")
    private String content;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt;

    @Column(name = "update_at", nullable = false)
    private LocalDateTime updateAt;

    @Builder
    public Board(Users users, String title, String category, String code, String content, LocalDateTime createAt, LocalDateTime updateAt) {
        this.users = users;
        this.title = title;
        this.category = category;
        this.code = code;
        this.content = content;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    public void update(String title, String code, String content, LocalDateTime updateAt){
        this.title = title;
        this.code = code;
        this.content = content;
        this.updateAt = updateAt;
    }
}
