package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailAuthService {

    private final RedisTemplate<String, String> redisTemplate;
    private final TokenProvider tokenProvider;
    private final EmailService emailService;

    //6자리 무작위 인증번호 발급 및 토큰 생성, 인증번호 이메일 보내기
    public void sendVerificationCode(String email) {
        String code = String.format("%06d", new Random().nextInt(999999));
        String token = tokenProvider.createEmailToken(email, code, 5);

        redisTemplate.opsForValue().set("email:auth:" + email, token, Duration.ofMinutes(5));

        emailService.sendEmail(email, "AIssue 회원가입 이메일 인증번호", "인증번호는 [" + code + "] 입니다. 5분 안에 입력해주세요");
    }

    public boolean verifyCode(String email, String inputCode) {
        String key = "email:auth:" + email;
        String savedToken = redisTemplate.opsForValue().get(key);
        if (savedToken != null && tokenProvider.getCode(savedToken).equals(inputCode)){
            redisTemplate.delete(key);
            return true;
        }
        return false;
    }
}
