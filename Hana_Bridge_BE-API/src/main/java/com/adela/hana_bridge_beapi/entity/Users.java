package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false, nullable = false)
    private Long id;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password", nullable = true)
    private String password;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "nickname", nullable = false)
    private String nickName;

    @Column(name = "oauth_provider", nullable = true)
    private String oauthProvider;

    @Column(name = "oauth_id", nullable = false)
    private String oauthId;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createdAt;

    @Builder
    public Users(String email, String password, String name, String nickName, String oauthProvider, String oauthId, String role) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.nickName = nickName;
        this.oauthProvider = oauthProvider;
        this.oauthId = oauthId;
        this.role = role;
        this.createdAt = LocalDateTime.now();
    }


}
