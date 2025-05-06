package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.token.TokenResponse;
import com.adela.hana_bridge_beapi.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthApiController {
    private final TokenService tokenService;

    @PostMapping("/auth/refresh")
    public ResponseEntity<TokenResponse> refresh(HttpServletRequest request){
        Cookie[] cookies = request.getCookies();
        if(cookies != null){
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("refreshToken")) {
                    String refreshToken = cookie.getValue();
                    String accessToken = tokenService.createNewAccessToken(refreshToken);
                    return ResponseEntity.ok().body(new TokenResponse(accessToken,""));
                }
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
