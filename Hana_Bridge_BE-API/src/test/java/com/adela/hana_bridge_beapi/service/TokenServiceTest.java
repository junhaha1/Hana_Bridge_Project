package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import com.adela.hana_bridge_beapi.entity.RefreshToken;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.RefreshTokenRepository;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class TokenServiceTest {

    @Mock
    private TokenProvider tokenProvider;
    @Mock
    private RefreshTokenRepository refreshTokenRepository;
    @Mock
    private UsersService usersService;

    @InjectMocks
    private TokenService tokenService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void AccessToken_처음_발급_테스트() {
        // given
        String email = "user@example.com";
        String role = "ROLE_USER";
        String expectedToken = "access.token";

        when(tokenProvider.createToken(eq(email), eq(role), anyLong())).thenReturn(expectedToken);

        // when
        String token = tokenService.createFirstAccessToken(email, role);

        // then
        assertThat(token).isEqualTo(expectedToken);
        verify(tokenProvider).createToken(eq(email), eq(role), anyLong());
    }

    @Test
    void AccessToken_재발급_성공() {
        String email = "user@example.com";
        String refreshToken = "valid.refresh.token";
        String role = "ROLE_USER";
        String newAccessToken = "new.access.token";

        DecodedJWT decodedJWT = mock(DecodedJWT.class);
        when(decodedJWT.getSubject()).thenReturn(email);
        when(tokenProvider.validateToken(eq(refreshToken))).thenReturn(decodedJWT);

        // ✅ 여기 중요!
        when(refreshTokenRepository.findById(eq(email)))
                .thenReturn(Optional.of(new RefreshToken(email, refreshToken)));

        Users user = Users.builder()
                .email(email)
                .role(role)
                .build();
        when(usersService.findByEmail(eq(email))).thenReturn(user);
        when(tokenProvider.createToken(eq(email), eq(role), anyLong()))
                .thenReturn(newAccessToken);

        String result = tokenService.createNewAccessToken(refreshToken);

        assertThat(result).isEqualTo(newAccessToken);
    }


    @Test
    void RefreshToken_생성_및_저장_테스트() {
        // given
        String email = "user@example.com";
        String role = "ROLE_USER";
        String refreshToken = "refresh.token";

        when(tokenProvider.createToken(eq(email), eq(role), anyLong())).thenReturn(refreshToken);

        // when
        String result = tokenService.createRefreshToken(email, role);

        // then
        assertThat(result).isEqualTo(refreshToken);
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void RefreshToken_조회_테스트() {
        // given
        String email = "user@example.com";
        String refreshToken = "refresh.token";
        RefreshToken savedToken = new RefreshToken(email, refreshToken);

        when(refreshTokenRepository.findById(email)).thenReturn(Optional.of(savedToken));

        // when
        RefreshToken found = tokenService.findByRefreshToken(email);

        // then
        assertThat(found.getEmail()).isEqualTo(email);
        assertThat(found.getRefreshToken()).isEqualTo(refreshToken);
    }

    @Test
    void RefreshToken_삭제_토큰기반_테스트() {
        // given
        String token = "mock.token.value";
        String email = "user@example.com";

        // token → email 변환 mock
        when(tokenProvider.getEmail(token)).thenReturn(email);

        // when
        tokenService.deleteRefreshToken(token);

        // then
        verify(tokenProvider).getEmail(token); // 토큰에서 이메일 추출 확인
        verify(refreshTokenRepository).deleteById(email); // 삭제 확인
    }
}
