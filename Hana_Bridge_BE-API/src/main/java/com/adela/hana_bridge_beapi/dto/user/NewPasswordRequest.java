package com.adela.hana_bridge_beapi.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NewPasswordRequest {
    private String oldPassword;
    private String newPassword;
}
