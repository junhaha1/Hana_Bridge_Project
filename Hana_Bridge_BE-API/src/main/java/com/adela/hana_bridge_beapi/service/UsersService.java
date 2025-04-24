package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UsersService {
    private final UsersRepository usersRepository;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    //회원가입 메서드 -> 구현 예정

    //회원정보 조회
    public Users findByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Email not found : " + email));
    }

    //로그인 인증
    public UserResponse login (String email, String password){
        Users users = usersRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Email not found : " + email));
        if (bCryptPasswordEncoder.matches(password,users.getPassword())){
            return UserResponse.builder()
                    .email(users.getEmail())
                    .name(users.getName())
                    .role(users.getRole())
                    .nickname(users.getNickName())
                    .build();
        } else{
            throw new IllegalArgumentException("Invalid Password Your Email : " + email);
        }
    }
}
