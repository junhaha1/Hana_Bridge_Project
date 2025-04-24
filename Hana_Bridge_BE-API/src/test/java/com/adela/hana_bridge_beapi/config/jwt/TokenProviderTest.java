package com.adela.hana_bridge_beapi.config.jwt;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

public class TokenProviderTest {

    private TokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setIssuer("test-issuer");
        jwtProperties.setSecretKey("test-secret");

        tokenProvider = new TokenProvider(jwtProperties);
    }

    @Test
    void 토큰_생성_및_검증_성공() {
        // given
        String email = "test@example.com";
        String role = "ROLE_USER";
        long expiration = 1000 * 60 * 10; // 10분

        // when
        String token = tokenProvider.createToken(email, role, expiration);
        DecodedJWT decoded = tokenProvider.validateToken(token);

        // then
        assertThat(decoded.getSubject()).isEqualTo(email);
        assertThat(decoded.getClaim("role").asString()).isEqualTo(role);
        assertThat(decoded.getIssuer()).isEqualTo("test-issuer");
    }

    @Test
    void 토큰에서_email과_role_정확히_추출() {
        // given
        String token = tokenProvider.createToken("hello@world.com", "ROLE_ADMIN", 1000 * 60 * 5);

        // when
        String email = tokenProvider.getEmail(token);
        String role = tokenProvider.getRole(token);

        // then
        assertThat(email).isEqualTo("hello@world.com");
        assertThat(role).isEqualTo("ROLE_ADMIN");
    }

    @Test
    void 유효하지_않은_토큰은_예외_발생() {
        // given
        String fakeToken = "this.is.not.a.real.jwt.token";

        // when & then
        assertThatThrownBy(() -> tokenProvider.validateToken(fakeToken))
                .isInstanceOf(Exception.class); // JWTVerificationException도 가능
    }
}
