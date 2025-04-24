package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import com.adela.hana_bridge_beapi.entity.RefreshToken;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.RefreshTokenRepository;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UsersService usersService;

    //AccessToken 유효시간 1시간
    private final long EXPIRATION_ACCESS_TIME = 1000 * 60 * 60;
    //RefreshToken 유효시간 24시간
    private final long EXPIRATION_REFRESH_TIME = 1000 * 60 * 60 * 24;


    //-------------AccessToken 기능--------------
    //AccessToken 로그인 시에 처음 발급
    public String createFirstAccessToken(String email, String role) {
        return tokenProvider.createToken(email, role, EXPIRATION_ACCESS_TIME);
    }

    //AccessToken 유효 시간 만료됐을 경우 RefreshToken 유효검사 후 재발급
    public String createNewAccessToken(String refreshToken) {
        DecodedJWT decoded;
        try {
            decoded = tokenProvider.validateToken(refreshToken);
        } catch (Exception e) {
            throw new IllegalArgumentException("Unexpected token", e);
        }

        String email = decoded.getSubject();
        Users users = usersService.findByEmail(email);

        return tokenProvider.createToken(users.getEmail(), users.getRole(), EXPIRATION_REFRESH_TIME);
    }

    //-------------RefreshToken 기능-------------
    //RefreshToken 발급
    public String createRefreshToken(String email, String role) {
        String refreshToken = tokenProvider.createToken(email, role, EXPIRATION_REFRESH_TIME);
        refreshTokenRepository.save(new RefreshToken(email, refreshToken));
        return refreshToken;
    }
    //RefreshToken 조회
    public RefreshToken findByRefreshToken(String email) {
        return refreshTokenRepository.findById(email)
                .orElseThrow(()->new IllegalArgumentException("Unexpected token your email: " + email));
    }
    //RefreshToken 삭제
    public void deleteRefreshToken(String token) {
        String email = tokenProvider.getEmail(token);
        refreshTokenRepository.deleteById(email);
    }
}
