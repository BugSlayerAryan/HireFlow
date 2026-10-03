package com.hireflow_ai_backend.controller;

import com.hireflow_ai_backend.entity.Application;
import com.hireflow_ai_backend.entity.Interview;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.repository.ApplicationRepository;
import com.hireflow_ai_backend.repository.InterviewRepository;
import com.hireflow_ai_backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private com.hireflow_ai_backend.repository.UserRepository userRepository;

    @Autowired
    private com.hireflow_ai_backend.repository.ApplicationRepository applicationRepository;

    @Autowired
    private com.hireflow_ai_backend.service.NotificationService notificationService;

    @PostMapping("/schedule/{applicationId}")
    public Interview scheduleInterview(
            @PathVariable Long applicationId,
            @RequestBody Map<String, Object> payload) {

        Application app = applicationRepository.findById(applicationId).orElseThrow();

        Interview interview = new Interview();
        interview.setApplication(app);
        String scheduledAtStr = (String) payload.get("scheduledAt");
        if (scheduledAtStr != null && scheduledAtStr.length() == 16) {
            scheduledAtStr += ":00";
        }
        interview.setScheduledAt(LocalDateTime.parse(scheduledAtStr));
        interview.setMeetingLink((String) payload.get("meetingLink"));
        interview.setNotes((String) payload.get("notes"));
        interview.setStatus("PENDING");

        Interview saved = interviewRepository.save(interview);

        // Notify Job Seeker in real-time via WebSocket
        notificationService.sendToUser(
                app.getUser().getEmail(),
                "Interview Scheduled! 📅",
                "Great news! Your interview for " + app.getJob().getTitle() + " has been scheduled.");

        return saved;
    }

    @GetMapping("/my")
    public List<Interview> getMyInterviews() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                .getName();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (user.getRole() == com.hireflow_ai_backend.entity.Role.ADMIN) {
            return interviewRepository.findAll();
        } else if (user.getRole() == com.hireflow_ai_backend.entity.Role.RECRUITER) {
            return interviewRepository.findByApplicationJobRecruiterId(user.getId());
        } else {
            return interviewRepository.findByApplicationUserId(user.getId());
        }
    }
}
