package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.user.LoginRequest;
import com.adela.hana_bridge_beapi.dto.user.UserRequest;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.dto.user.UsersRegistRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class UsersApiController {

    private final UsersService usersService;
    private final TokenService tokenService;

    //회원가입 API 호출 -> 구현 예정
    @PostMapping("/user")
    public ResponseEntity<Void> createUser(@Valid @RequestBody UsersRegistRequest usersRegistRequest) {
        usersService.registerUser(usersRegistRequest);
        return ResponseEntity.ok().build();
    }

    //사용자 정보 조회
    @GetMapping("/user/me")
    public ResponseEntity<UserResponse> getUser(@RequestHeader("Authorization") String authHeader) {
        String email = getEmailFromHeader(authHeader);
        Users users = usersService.findByEmail(email);
        return ResponseEntity.ok().body(UserResponse
                .builder()
                .email(email)
                .name(users.getName())
                .nickname(users.getNickName())
                .role(users.getRole())
                .build()
        );
    }
    //사용자 정보 수정 API
    @PutMapping("/user/me")
    public ResponseEntity<UserResponse> updateUser(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserRequest userRequest) {
        Long userId = getUserIdFromHeader(authHeader);
        UserResponse userResponse = usersService.updateUser(userId, userRequest);

        return ResponseEntity.ok().body(userResponse);
    }

    //사용자 탈퇴
    @DeleteMapping("/user/me")
    public ResponseEntity<Void> deleteUser(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromHeader(authHeader);
        //userId를 이용하여 삭제
        usersService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    //Header에 있는 accessToken에서 Email 추출
    private String getEmailFromHeader(String authHeader) {
        String accessToken = authHeader.replace("Bearer ", "");
        return tokenService.findEmailByToken(accessToken);
    }

    //Header에 있는 accessToken에서 UserId 추출
    private Long getUserIdFromHeader(String authHeader) {
        String accessToken = authHeader.replace("Bearer ", "");
        return tokenService.findUsersIdByToken(accessToken);
    }



    //로그인 API 호출
    @PostMapping("/user/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
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
