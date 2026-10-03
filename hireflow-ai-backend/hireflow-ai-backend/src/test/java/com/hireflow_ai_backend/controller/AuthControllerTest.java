package com.hireflow_ai_backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.hireflow_ai_backend.dto.LoginRequest;
import com.hireflow_ai_backend.entity.Role;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.security.JwtUtil;
import com.hireflow_ai_backend.service.UserService;

class AuthControllerTest {
    private final UserService userService = org.mockito.Mockito.mock(UserService.class);
    private final JwtUtil jwtUtil = org.mockito.Mockito.mock(JwtUtil.class);
    private final PasswordEncoder passwordEncoder = org.mockito.Mockito.mock(PasswordEncoder.class);
    private AuthController controller;

    @BeforeEach
    void setUp() {
        controller = new AuthController();
        ReflectionTestUtils.setField(controller, "userService", userService);
        ReflectionTestUtils.setField(controller, "jwtUtil", jwtUtil);
        ReflectionTestUtils.setField(controller, "passwordEncoder", passwordEncoder);
    }

    @Test
    void rejectsLoginWhenSelectedRoleDoesNotMatchAccountRole() {
        User user = new User();
        user.setId(10L);
        user.setEmail("recruiter@example.com");
        user.setName("Recruiter");
        user.setPassword("hash");
        user.setRole(Role.RECRUITER);

        when(userService.findByEmail("recruiter@example.com")).thenReturn(user);
        when(passwordEncoder.matches("secret", "hash")).thenReturn(true);

        LoginRequest request = new LoginRequest();
        request.setEmail("recruiter@example.com");
        request.setPassword("secret");
        request.setRole("JOB_SEEKER");

        ResponseStatusException error = assertThrows(ResponseStatusException.class, () -> controller.login(request));
        assertEquals(HttpStatus.FORBIDDEN, error.getStatusCode());
    }

    @Test
    void acceptsLoginWhenSelectedRoleMatchesAccountRole() {
        User user = new User();
        user.setId(10L);
        user.setEmail("recruiter@example.com");
        user.setName("Recruiter");
        user.setPassword("hash");
        user.setRole(Role.RECRUITER);

        when(userService.findByEmail("recruiter@example.com")).thenReturn(user);
        when(passwordEncoder.matches("secret", "hash")).thenReturn(true);
        when(jwtUtil.generateToken(user)).thenReturn("jwt");

        LoginRequest request = new LoginRequest();
        request.setEmail("recruiter@example.com");
        request.setPassword("secret");
        request.setRole("RECRUITER");

        var response = controller.login(request);
        assertEquals("RECRUITER", response.getRole());
        assertEquals("jwt", response.getToken());
    }
}
