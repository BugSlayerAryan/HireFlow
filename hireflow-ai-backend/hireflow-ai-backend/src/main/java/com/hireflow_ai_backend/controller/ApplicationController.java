package com.hireflow_ai_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hireflow_ai_backend.ai.ResumeMatchService;
import com.hireflow_ai_backend.entity.Application;
import com.hireflow_ai_backend.entity.ApplicationStatus;
import com.hireflow_ai_backend.entity.Job;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.repository.ApplicationRepository;
import com.hireflow_ai_backend.repository.JobRepository;
import com.hireflow_ai_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ResumeMatchService resumeMatchService;

    @Autowired
    private com.hireflow_ai_backend.service.NotificationService notificationService;

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('JOB_SEEKER')")
    @GetMapping("/my")
    public List<Application> getMyApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return applicationRepository.findByUserId(user.getId());
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/recruiter")
    public List<Application> getRecruiterApplications() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return applicationRepository.findByJobRecruiterId(user.getId());
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/{id}/status")
    public Application updateStatus(
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {
        Application app = applicationRepository
                .findById(id)
                .orElseThrow();

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email).orElseThrow();
        if (app.getJob() == null || app.getJob().getRecruiter() == null
                || !app.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "You can only update applications for your own jobs");
        }

        app.setStatus(status);
        Application saved = applicationRepository.save(app);

        // Notify Job Seeker
        notificationService.sendToUser(
                app.getUser().getEmail(),
                "Application Update",
                "Your application for " + app.getJob().getTitle() + " has been " + status);

        return saved;
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('JOB_SEEKER')")
    @PostMapping("/apply/{jobId}")
    public Application apply(@PathVariable Long jobId, @RequestParam String resume) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        // Calculate match score using AI service
        int score = resumeMatchService.calculateMatch(resume, job.getSkillsRequired());

        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setMatchScore(score);
        application.setStatus(ApplicationStatus.APPLIED);
        application.setCreatedAt(java.time.LocalDateTime.now());

        Application saved = applicationRepository.save(application);

        // Notify Recruiter
        notificationService.sendToUser(
                job.getRecruiter().getEmail(),
                "New Applicant",
                user.getName() + " applied for " + job.getTitle() + " (Score: " + score + "%)");

        return saved;
    }
}
