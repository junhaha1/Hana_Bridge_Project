package com.adela.hana_bridge_beapi.dto.user;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String email;
    private String name;
    private String nickname;
    private String password;
}
