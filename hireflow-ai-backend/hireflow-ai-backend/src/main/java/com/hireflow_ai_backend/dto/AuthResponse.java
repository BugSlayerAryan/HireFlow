package com.hireflow_ai_backend.dto;

public class AuthResponse {
    private final String token;
    private final String role;
    private final String name;
    private final Long userId;
    private final String profileImageUrl;

    public AuthResponse(String token, String role, String name, Long userId, String profileImageUrl) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.userId = userId;
        this.profileImageUrl = profileImageUrl;
    }

    public String getToken() { return token; }
    public String getRole() { return role; }
    public String getName() { return name; }
    public Long getUserId() { return userId; }
    public String getProfileImageUrl() { return profileImageUrl; }
}
