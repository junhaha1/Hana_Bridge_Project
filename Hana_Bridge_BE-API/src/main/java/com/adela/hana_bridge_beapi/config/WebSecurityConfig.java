package com.adela.hana_bridge_beapi.config;

import com.adela.hana_bridge_beapi.config.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final UserDetailsService userService;
    private final TokenProvider tokenProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception
                        // 로그인 하지 않거나 Accesstoken 만료 시에 인증 실패 (401)
                        .authenticationEntryPoint(authenticationEntryPoint())
                        // 로그인 했지만 권한이 없을 경우 인가 실패 (403)
                        .accessDeniedHandler(accessDeniedHandler())
                )
                .addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        //로그인하지 않아도 공지, 코드, assemble 게시판은 사용가능
                        .requestMatchers(HttpMethod.GET, "/board/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/assemble/**").permitAll()
                        //로그인 접속
                        .requestMatchers(HttpMethod.POST, "/user/login").permitAll()
                        //로그아웃 접속
                        .requestMatchers(HttpMethod.DELETE, "/user/logout").permitAll()
                        //회원 가입
                        .requestMatchers(HttpMethod.POST, "/user").permitAll()

                        //글 등록, 수정, 삭제, ChatBot 이용은 ROLE_USER, ROLE_ADMIN만 접근 가능(ROLE_GUEST는 불가능)
                        //공지 글 접근권한 제한은 Controller에서 제한
                        .requestMatchers(HttpMethod.POST, "/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .requestMatchers("/chat/**").hasAnyAuthority("ROLE_USER", "ROLE_ADMIN")
                        .anyRequest().permitAll()
                )
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http,
                                                       BCryptPasswordEncoder bCryptPasswordEncoder,
                                                       UserDetailsService userDetailsService) throws Exception {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(bCryptPasswordEncoder);
        return new ProviderManager(authProvider);
    }
    /*Spring Security 예외 처리*/
    //401 로그인하지 않고 접근 시에
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(401);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"로그인이 필요합니다.\"}");
        };
    }
    //403 로그인 했지만 권한이 없을 시에
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(403);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\": \"접근 권한이 없습니다.\"}");
        };
    }


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter(tokenProvider); //
    }
}
