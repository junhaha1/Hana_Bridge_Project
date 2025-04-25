package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.user.UserRequest;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.dto.user.UsersRegistRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.repository.UsersRepository;
import jakarta.transaction.Transactional;
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

    //회원가입 메서드
    public void registerUser(UsersRegistRequest usersRegistRequest) {
        //비밀번호 암호화
        usersRegistRequest.setPassword(bCryptPasswordEncoder.encode(usersRegistRequest.getPassword()));

        usersRepository.save(usersRegistRequest.toEntity());
    }

    //email 기반 회원정보 조회
    public Users findByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(()-> new IllegalArgumentException("Email not found : " + email));
    }

    //사용자 정보 수정
    @Transactional
    public UserResponse updateUser(Long userId, UserRequest userRequest) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("User not found : " + userId));

        //비밀번호 암호화
        userRequest.setPassword(bCryptPasswordEncoder.encode(userRequest.getPassword()));

        //영속성 이용하여 정보 갱신
        users.updateUsers(
                userRequest.getEmail(),
                userRequest.getPassword(),
                userRequest.getNickname()
        );

        return UserResponse.builder()
                .email(users.getEmail())
                .name(users.getName())
                .nickname(users.getNickName())
                .build();
    }

    //사용자 탈퇴
    public void deleteUser(Long userId) {
        usersRepository.deleteById(userId);
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
