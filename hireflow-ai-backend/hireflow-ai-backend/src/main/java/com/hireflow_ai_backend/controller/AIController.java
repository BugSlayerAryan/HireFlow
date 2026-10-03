package com.hireflow_ai_backend.controller;

import java.util.List;

import org.apache.tika.exception.TikaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hireflow_ai_backend.ai.ResumeMatchService;
import com.hireflow_ai_backend.entity.Job;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.repository.JobRepository;
import com.hireflow_ai_backend.repository.UserRepository;
import com.hireflow_ai_backend.service.JobRecommendationService;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private ResumeMatchService service;

    @Autowired
    private JobRecommendationService recommendationService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/recommend")
    List<Job> getRecommendations() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Job> allJobs = jobRepository.findAll();

        return recommendationService.recommend(user.getSkills(), allJobs);
    }

    @PostMapping("/match")
    public java.util.Map<String, Object> match(
            @RequestParam("resumeFile") org.springframework.web.multipart.MultipartFile resumeFile,
            @RequestParam String job) throws java.io.IOException, TikaException {
        return service.analyzeMatchFromFile(resumeFile, job);
    }

    @PostMapping("/chat")
    public java.util.Map<String, String> chat(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        String message = payload.get("message");
        // Higher quality role extraction: Extract actual role name from Authorities
        String role = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .stream()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .findFirst()
                .orElse("USER");

        String response = service.getAIChatResponse(message, role);
        return java.util.Collections.singletonMap("response", response);
    }

    @PostMapping("/screening/complete")
    public java.util.Map<String, String> completeScreening(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, Object> payload) {
        // Log the screening results for now (Could be saved to a database table if
        // required)
        System.out.println("AI Screening Completed: " + payload.get("role"));
        System.out.println("Feedback generated: " + payload.get("feedback"));

        return java.util.Collections.singletonMap("status", "Screening recorded successfully");
    }

    @PostMapping("/generate-job-description")
    public java.util.Map<String, String> generateJobDescription(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        String title = payload.get("title");
        String currentDescription = payload.get("description");
        String skills = payload.get("skills");

        String enhancedDescription = service.generateEnhancedJobDescription(title, currentDescription, skills);
        return java.util.Collections.singletonMap("description", enhancedDescription);
    }

    @PostMapping("/generate-bio")
    public java.util.Map<String, String> generateBio(
            @org.springframework.web.bind.annotation.RequestBody java.util.Map<String, String> payload) {
        String name = payload.get("name");
        String currentBio = payload.get("bio");
        String skills = payload.get("skills");

        String enhancedBio = service.generateEnhancedBio(name, currentBio, skills);
        return java.util.Collections.singletonMap("bio", enhancedBio);
    }
}
