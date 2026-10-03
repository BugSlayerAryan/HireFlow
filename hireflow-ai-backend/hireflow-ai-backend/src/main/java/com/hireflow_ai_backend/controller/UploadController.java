package com.hireflow_ai_backend.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.service.FileStorageService;
import com.hireflow_ai_backend.service.UserService;

@RestController
@RequestMapping("/api/files")
public class UploadController {
    private final FileStorageService fileStorageService;
    private final UserService userService;

    public UploadController(FileStorageService fileStorageService, UserService userService) {
        this.fileStorageService = fileStorageService;
        this.userService = userService;
    }

    @PostMapping("/profile-image")
    public Map<String, String> uploadProfileImage(@RequestParam("image") MultipartFile image) {
        String url = fileStorageService.storeImage(image, "profiles");
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        if (user == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "User session is no longer valid");
        }
        user.setProfileImageUrl(url);
        userService.save(user);
        return Map.of("url", url);
    }

    @PreAuthorize("hasRole('RECRUITER')")
    @PostMapping("/company-image")
    public Map<String, String> uploadCompanyImage(@RequestParam("image") MultipartFile image) {
        return Map.of("url", fileStorageService.storeImage(image, "companies"));
    }
}
