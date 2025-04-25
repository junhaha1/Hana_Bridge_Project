package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.user.LoginRequest;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UsersApiController {

    private final UsersService usersService;
    private final TokenService tokenService;

    //회원가입 API 호출 -> 구현 예정
    //로그인 API 호출
    @PostMapping("/user/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        UserResponse userResponse = usersService.login(loginRequest.getEmail(), loginRequest.getPassword());

        String accessToken = tokenService.createFirstAccessToken(userResponse.getEmail(), userResponse.getRole());
        String refreshToken = tokenService.createRefreshToken(userResponse.getEmail(), userResponse.getRole());
        userResponse.setAccessToken(accessToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60 * 24)
                //로컬 테스트용 쿠키 설정
                .sameSite("Lax")
                .secure(false)
                //--------------------
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok().body(userResponse);
    }

    //로그아웃 API 호출
    @DeleteMapping("user/logout")
    @WithMockUser
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response){
        // 1. 쿠키에서 refreshToken 꺼내기
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // 2. refreshToken이 없으면 예외 처리
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3. 토큰 삭제 (ex. Redis에서 제거)
        tokenService.deleteRefreshToken(refreshToken);

        // 4. 브라우저 쿠키 삭제
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // HTTPS 환경에선 true
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", deleteCookie.toString());

        return ResponseEntity.ok().build();
    }
}
