package com.adela.hana_bridge_beapi.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Users implements UserDetails {
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

    @Column(name = "oauth_id", nullable = true)
    private String oauthId;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "question_count", nullable = false)
    private int questionCount;

    @Column(name = "summary_count", nullable = false)
    private int summaryCount;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public String getUsername() {
        return email;  // 로그인 ID로 email 사용
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // 계정 만료 여부
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;  // 계정 잠김 여부
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // 비밀번호 만료 여부
    }

    @Override
    public boolean isEnabled() {
        return true;  // 계정 활성 여부
    }



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

    //사용자 정보 갱신 시에 해당 필드 값만 변경
    public void updateUsers(String email, String nickName) {
        this.email = email;
        this.nickName = nickName;
    }

    public void updateQuestionCount(int questionCount) {
        if(questionCount == 0){
            this.questionCount = 0;
        } else {
            this.questionCount = questionCount - 1;
        }
    }

    public void updateSummaryCount(int summaryCount) {
        if(summaryCount == 0){
            this.summaryCount = 0;
        }else {
            this.summaryCount = summaryCount - 1;
        }
    }

    public void updatePassword(String password) {
        this.password = password;
    }
}
