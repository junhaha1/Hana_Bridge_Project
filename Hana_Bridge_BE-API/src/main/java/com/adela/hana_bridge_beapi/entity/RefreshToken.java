package com.adela.hana_bridge_beapi.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@Getter
@NoArgsConstructor
@AllArgsConstructor
//1일 유지
@RedisHash(value = "refreshToken", timeToLive = 60 * 60 * 24)
public class RefreshToken {
    @Id
    private String email;
    private String refreshToken;
}
