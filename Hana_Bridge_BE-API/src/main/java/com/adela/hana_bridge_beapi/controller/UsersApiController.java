package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.user.LoginRequest;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String bearerToken){
        tokenService.deleteRefreshToken(bearerToken.replace("Bearer ", ""));
        return ResponseEntity.ok().build();
    }
}
