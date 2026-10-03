//package com.hireflow_ai_backend.controller;
//
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.hireflow_ai_backend.entity.Job;
//import com.hireflow_ai_backend.entity.User;
//import com.hireflow_ai_backend.repository.JobRepository;
//import com.hireflow_ai_backend.repository.UserRepository;
//
//@RestController
//@RequestMapping("/api/admin")
//public class AdminController {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private JobRepository jobRepository;
//
//    @GetMapping("/users")
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    @GetMapping("/jobs")
//    public List<Job> getAllJobs() {
//        return jobRepository.findAll();
//    }
//
//    @org.springframework.web.bind.annotation.DeleteMapping("/users/{id}")
//    public void deleteUser(@org.springframework.web.bind.annotation.PathVariable Long id) {
//        userRepository.deleteById(id);
//    }
//
//    @org.springframework.web.bind.annotation.DeleteMapping("/jobs/{id}")
//    public void deleteJob(@org.springframework.web.bind.annotation.PathVariable Long id) {
//        jobRepository.deleteById(id);
//    }
//}



package com.hireflow_ai_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hireflow_ai_backend.entity.Job;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.repository.JobRepository;
import com.hireflow_ai_backend.repository.UserRepository;
import com.hireflow_ai_backend.service.UserService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final UserService userService;

    public AdminController(
            UserRepository userRepository,
            JobRepository jobRepository,
            UserService userService
    ) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.userService = userService;
    }

    /*
     * ================================
     * GET ALL USERS
     * ================================
     */
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /*
     * ================================
     * GET ALL JOBS
     * ================================
     */
    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    /*
     * ================================
     * DELETE USER
     * ================================
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, String>> deleteUser(
            @PathVariable Long id
    ) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "User deleted successfully"
                )
        );
    }

    /*
     * ================================
     * DELETE JOB
     * ================================
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(
            @PathVariable Long id
    ) {

        if (!jobRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        jobRepository.deleteById(id);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Job deleted successfully"
                )
        );
    }
}