package com.adela.hana_bridge_beapi.dto.user;

import com.adela.hana_bridge_beapi.entity.Users;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsersRegistRequest {

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "이름은 필수 입력값입니다.")
    private String name;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    private String nickName;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;

    public Users toEntity() {
        return Users.builder()
                .email(this.email)
                .name(this.name)
                .nickName(this.nickName)
                .role("ROLE_USER")
                .password(this.password)
                .build();
    }
}
