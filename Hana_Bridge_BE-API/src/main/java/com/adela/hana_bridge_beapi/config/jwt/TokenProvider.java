package com.adela.hana_bridge_beapi.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Date;

@RequiredArgsConstructor
@Component
public class TokenProvider {
    private final JwtProperties jwtProperties;

    public String createToken(String email, String role, long expirationMillis) {
        return JWT.create()
                .withSubject(email)
                .withIssuer(jwtProperties.getIssuer())
                .withClaim("role", role)
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationMillis))
                .sign(Algorithm.HMAC256(jwtProperties.getSecretKey()));
    }

    public DecodedJWT validateToken(String token) {
        if (token == null || token.isBlank()) {
            throw new JwtValidationException("토큰이 제공되지 않았습니다.", HttpStatus.UNAUTHORIZED);
        }

        try {
            return JWT.require(Algorithm.HMAC256(jwtProperties.getSecretKey()))
                    .withIssuer(jwtProperties.getIssuer())
                    .build()
                    .verify(token);
        } catch (JWTVerificationException ex) {
            throw new JwtValidationException("유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED);
        }
    }

    public String getEmail(String token) {
        return validateToken(token).getSubject();
    }

    public String getRole(String token) {
        return validateToken(token).getClaim("role").asString();
    }
}
