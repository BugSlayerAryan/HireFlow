package com.hireflow_ai_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.hireflow_ai_backend.dto.AuthResponse;
import com.hireflow_ai_backend.dto.LoginRequest;
import com.hireflow_ai_backend.entity.Role;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.security.JwtUtil;
import com.hireflow_ai_backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired private UserService userService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        if (user.getRole() == null) user.setRole(Role.JOB_SEEKER);
        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin accounts cannot self-register");
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }
        return userService.register(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        String email = request.getEmail() == null ? "" : request.getEmail().trim();
        User user = userService.findByEmail(email);
        if (user == null || request.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            Role selectedRole;
            try {
                selectedRole = Role.valueOf(request.getRole().trim().toUpperCase().replace("ROLE_", ""));
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role selected");
            }
            if (selectedRole != user.getRole()) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                        "This account is registered as " + user.getRole().name().replace('_', ' ') + ", not " + selectedRole.name().replace('_', ' '));
            }
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name(), user.getName(), user.getId(), user.getProfileImageUrl());
    }

    @GetMapping("/user")
    public User getProfile() {
        return currentUser();
    }

    @PutMapping("/profile")
    public User updateProfile(@RequestBody User profileData) {
        User user = currentUser();
        if (profileData.getName() != null) user.setName(profileData.getName().trim());
        user.setSkills(profileData.getSkills());
        user.setBio(profileData.getBio());
        return userService.save(user);
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User session is no longer valid");
        return user;
    }
}
