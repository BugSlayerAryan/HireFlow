package com.hireflow_ai_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hireflow_ai_backend.entity.Job;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.repository.JobRepository;
import com.hireflow_ai_backend.repository.UserRepository;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('RECRUITER')")
    @PostMapping
    public Job postJob(@RequestBody Job job) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        job.setRecruiter(user);
        return jobRepository.save(job);
    }

    @GetMapping
    public List<Job> getJobs() {
        return jobRepository.findAll();
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasRole('RECRUITER')")
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public void deleteJob(@org.springframework.web.bind.annotation.PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        Job job = jobRepository.findById(id).orElseThrow();

        if (!job.getRecruiter().getId().equals(user.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "You can only delete your own jobs");
        }

        jobRepository.deleteById(id);
    }
}
