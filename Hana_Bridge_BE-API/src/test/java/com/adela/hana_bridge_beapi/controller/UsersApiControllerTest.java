package com.adela.hana_bridge_beapi.controller;

import com.adela.hana_bridge_beapi.dto.user.LoginRequest;
import com.adela.hana_bridge_beapi.dto.user.UserResponse;
import com.adela.hana_bridge_beapi.service.TokenService;
import com.adela.hana_bridge_beapi.service.UsersService;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

class UsersApiControllerTest {

    @InjectMocks
    private UsersApiController usersApiController;

    @Mock
    private UsersService usersService;

    @Mock
    private TokenService tokenService;

    @Mock
    private HttpServletResponse response;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void login_정상_동작_테스트() {
        // given
        String email = "user@example.com";
        String password = "securePass";
        String role = "ROLE_USER";
        String nickname = "user_nick";
        String name = "User Name";
        String accessToken = "access.token";
        String refreshToken = "refresh.token";

        LoginRequest loginRequest = new LoginRequest(email, password);

        // 서비스에서 반환할 UserResponse 객체
        UserResponse mockUserResponse = UserResponse.builder()
                .email(email)
                .name(name)
                .nickname(nickname)
                .role(role)
                .build();

        when(usersService.login(email, password)).thenReturn(mockUserResponse);
        when(tokenService.createFirstAccessToken(email, role)).thenReturn(accessToken);
        when(tokenService.createRefreshToken(email, role)).thenReturn(refreshToken);

        // when
        ResponseEntity<UserResponse> responseEntity = usersApiController.login(loginRequest, response);

        // then
        UserResponse responseBody = responseEntity.getBody();

        assertThat(responseBody).isNotNull();
        assertThat(responseBody.getEmail()).isEqualTo(email);
        assertThat(responseBody.getRole()).isEqualTo(role);
        assertThat(responseBody.getAccessToken()).isEqualTo(accessToken);

        verify(response).addHeader(eq("Set-Cookie"), contains("refreshToken=" + refreshToken));
    }
}
