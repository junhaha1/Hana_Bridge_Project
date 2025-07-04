package com.adela.hana_bridge_beapi.service;

import com.adela.hana_bridge_beapi.dto.user.UserQuestionInfoResponse;
import com.adela.hana_bridge_beapi.dto.user.UserUpdateRequest;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.dto.user.UsersRegistRequest;
import com.adela.hana_bridge_beapi.entity.Users;
import com.adela.hana_bridge_beapi.errorhandler.error.UserEmailNotFoundException;
import com.adela.hana_bridge_beapi.errorhandler.error.UserIdNotFoundException;
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
    @Transactional
    public void registerUser(UsersRegistRequest usersRegistRequest) {
        //비밀번호 암호화
        usersRegistRequest.setPassword(bCryptPasswordEncoder.encode(usersRegistRequest.getPassword()));

        usersRepository.save(usersRegistRequest.toEntity());
    }

    //email 기반 회원정보 조회
    public Users findByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElseThrow(()-> new UserEmailNotFoundException(email));
    }

    //비밀번호 변경
    @Transactional
    public void updatePassword(Long userId, String oldPassword, String newPassword) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new UserIdNotFoundException(userId));
        if (!bCryptPasswordEncoder.matches(oldPassword, users.getPassword())) {
            throw new IllegalArgumentException("Invalid Your Current Password!");
        }
        users.updatePassword(bCryptPasswordEncoder.encode(newPassword));
    }

    //사용자 정보 수정
    @Transactional
    public UserResponse updateUser(Long userId, UserUpdateRequest userRequest) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new UserIdNotFoundException(userId));

        //영속성 이용하여 정보 갱신
        users.updateUsers(
                userRequest.getEmail(),
                userRequest.getNickName()
        );

        return UserResponse.builder()
                .email(users.getEmail())
                .name(users.getName())
                .nickName(users.getNickName())
                .build();
    }
    @Transactional
    public void addQuestionCount(Long userId) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new UserIdNotFoundException(userId));

        users.addTotalQuestion();
    }

    @Transactional
    public void addSummaryCount(Long userId) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new UserIdNotFoundException(userId));

        users.addTotalSummary();
    }

    //사용자 질문 횟수 수정
    @Transactional
    public UserQuestionInfoResponse updateQuestionCount(Long userId) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new UserIdNotFoundException(userId));

        users.updateQuestionCount(users.getQuestionCount());

        return new UserQuestionInfoResponse(users.getQuestionCount(), users.getSummaryCount());
    }
    //사용자 요약 횟수 수정
    @Transactional
    public UserQuestionInfoResponse updateSummaryCount(Long userId) {
        Users users = usersRepository.findById(userId)
                .orElseThrow(()-> new UserIdNotFoundException(userId));

        users.updateSummaryCount(users.getSummaryCount());

        return new UserQuestionInfoResponse(users.getQuestionCount(), users.getSummaryCount());
    }

    //사용자 탈퇴
    @Transactional
    public void deleteUser(Long userId) {
        usersRepository.deleteById(userId);
    }

    //로그인 인증
    public UserResponse login (String email, String password){
        Users users = usersRepository.findByEmail(email)
                .orElseThrow(()-> new UserEmailNotFoundException(email));
        if (bCryptPasswordEncoder.matches(password,users.getPassword())){
            return UserResponse.builder()
                    .email(users.getEmail())
                    .name(users.getName())
                    .role(users.getRole())
                    .nickName(users.getNickName())
                    .questionCount(users.getQuestionCount())
                    .summaryCount(users.getSummaryCount())
                    .build();
        } else{
            throw new IllegalArgumentException("Invalid Password Your Email : " + email);
        }
    }
}
