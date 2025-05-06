package com.adela.hana_bridge_beapi.dto.token;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
public class TokenResponse {
    private final String accessToken;
    private final String refreshToken;
}
