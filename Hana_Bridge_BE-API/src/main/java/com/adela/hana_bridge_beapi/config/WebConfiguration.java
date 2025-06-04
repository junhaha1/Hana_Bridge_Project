package com.adela.hana_bridge_beapi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(final CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:5173",
                        "https://aissue-dev.kro.kr",
                        "http://aissue-dev.kro.kr",
                        "http://14.63.178.152",
                        "http://14.63.178.151"
                ) // React 개발 서버 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 🔥 이게 꼭 필요!
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
