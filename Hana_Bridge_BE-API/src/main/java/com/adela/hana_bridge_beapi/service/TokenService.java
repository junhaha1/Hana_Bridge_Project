package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.jwt.JwtValidationException;
import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import com.adela.hana_bridge_beapi.entity.RefreshToken;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.errorhandler.error.UserEmailNotFoundException;
import com.adela.hana_bridge_beapi.repository.RefreshTokenRepository;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Duration;

@RequiredArgsConstructor
@Service
public class TokenService {
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UsersService usersService;

    //AccessToken 유효시간 1시간
    //private final long EXPIRATION_ACCESS_TIME = 1000 * 60 * 60; //실제 서비스할 때 사용할 시간
    //AccessToken 유효시간 12시간
    private final long EXPIRATION_ACCESS_TIME = 1000 * 60 * 60; //테스트용
    //RefreshToken 유효시간 24시간
    private final long EXPIRATION_REFRESH_TIME = 1000 * 60 * 60 * 24;

    //-------------Token 공통 기능--------------
    //Token에서 Users
    public Long findUsersIdByToken(String token) {
        String email = tokenProvider.getEmail(token);
        Users users = usersService.findByEmail(email);
        return users.getId();
    }

    //Token에서 Email 추출
    public String findEmailByToken(String token) {
        return tokenProvider.getEmail(token);
    }

    //Token에서 Role 추출
    public String findRoleByToken(String token) {
        return tokenProvider.getRole(token);
    }

    //-------------AccessToken 기능--------------
    //AccessToken 로그인 시에 처음 발급
    public String createFirstAccessToken(String email, String role) {
        return tokenProvider.createToken(email, role, EXPIRATION_ACCESS_TIME);
    }

    //AccessToken 유효 시간 만료됐을 경우 RefreshToken 유효검사 후 재발급
    public String createNewAccessToken(String refreshToken) {
        try{
            DecodedJWT decoded;
            decoded = tokenProvider.validateToken(refreshToken);

            String email = decoded.getSubject();
            String redisRefreshToken = refreshTokenRepository.findById(email).get().getRefreshToken();

            if (redisRefreshToken == null || !redisRefreshToken.equals(refreshToken)) {
                throw new JwtValidationException("refresh 토큰이 유효하지 않습니다.", HttpStatus.UNAUTHORIZED);
            }

            Users users = usersService.findByEmail(email);

            return tokenProvider.createToken(users.getEmail(), users.getRole(), EXPIRATION_ACCESS_TIME);
        } catch (JwtValidationException e) {
            throw new JwtValidationException("refresh 토큰 검증 실패", HttpStatus.UNAUTHORIZED);
        } catch (RuntimeException e) {
            throw new JwtValidationException("토큰 갱신 중 서버 오류", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //-------------RefreshToken 기능-------------
    //RefreshToken 발급
    @Transactional
    public String createRefreshToken(String email, String role) {
        String refreshToken = tokenProvider.createToken(email, role, EXPIRATION_REFRESH_TIME);
        refreshTokenRepository.save(new RefreshToken(email, refreshToken));
        return refreshToken;
    }
    //RefreshToken 조회
    public RefreshToken findByRefreshToken(String email) {
        return refreshTokenRepository.findById(email)
                .orElseThrow(()->new UserEmailNotFoundException(email));
    }
    //RefreshToken 삭제
    @Transactional
    public void deleteRefreshToken(String token) {
        String email = tokenProvider.getEmail(token);
        refreshTokenRepository.deleteById(email);
    }
}
