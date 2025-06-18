package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.token.TokenResponse;
import com.adela.hana_bridge_beapi.service.EmailAuthService;
import com.adela.hana_bridge_beapi.service.TokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthApiController {
    private final TokenService tokenService;
    private final EmailAuthService emailAuthService;

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

    @PostMapping("/auth/email/send")
    public ResponseEntity<String> sendEmail(@RequestParam String email){
        emailAuthService.sendVerificationCode(email);
        return ResponseEntity.ok("인증번호가 이메일로 전송되었습니다.");
    }

    @PostMapping("/auth/email/verify")
    public ResponseEntity<String> verifyCode(@RequestParam String email, @RequestParam String code){
        boolean verified = emailAuthService.verifyCode(email, code);
        if (verified) {
            return ResponseEntity.ok("이메일 인증 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증번호가 틀렸거나 만료되었습니다.");
        }
    }
}
