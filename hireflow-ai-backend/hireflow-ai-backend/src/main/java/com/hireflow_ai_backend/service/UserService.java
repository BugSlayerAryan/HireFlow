//package com.hireflow_ai_backend.service;
//
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import com.hireflow_ai_backend.entity.User;
//import com.hireflow_ai_backend.repository.UserRepository;
//
//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    public User register(User user) {
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        return userRepository.save(user);
//    }
//
//    public User save(User user) {
//        return userRepository.save(user);
//    }
//
//    public void deleteUser(Long id) {
//        userRepository.deleteById(id);
//    }
//
//    public User findByEmail(String email) {
//        return userRepository.findByEmailIgnoreCase(email).orElse(null);
//    }
//
//    public List<User> findAll() {
//        return userRepository.findAll();
//    }
//}


package com.hireflow_ai_backend.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.hireflow_ai_backend.entity.Application;
import com.hireflow_ai_backend.entity.Interview;
import com.hireflow_ai_backend.entity.Job;
import com.hireflow_ai_backend.entity.Role;
import com.hireflow_ai_backend.entity.User;

import com.hireflow_ai_backend.repository.ApplicationRepository;
import com.hireflow_ai_backend.repository.InterviewRepository;
import com.hireflow_ai_backend.repository.JobRepository;
import com.hireflow_ai_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final JobRepository jobRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            ApplicationRepository applicationRepository,
            InterviewRepository interviewRepository,
            JobRepository jobRepository
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.jobRepository = jobRepository;
    }

    /*
     * =====================================================
     * REGISTER USER
     * =====================================================
     */
    public User register(User user) {

        if (user.getPassword() == null ||
                user.getPassword().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Password is required"
            );
        }

        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        return userRepository.save(user);
    }

    /*
     * =====================================================
     * SAVE USER
     * =====================================================
     */
    public User save(User user) {
        return userRepository.save(user);
    }

    /*
     * =====================================================
     * DELETE USER
     *
     * Delete order:
     *
     * Interviews
     *      ↓
     * Applications
     *      ↓
     * Recruiter Jobs
     *      ↓
     * User
     *
     * Transaction means:
     * if something fails, everything rolls back.
     * =====================================================
     */
    @Transactional
    public void deleteUser(Long userId) {

        /*
         * ---------------------------------
         * Find user
         * ---------------------------------
         */

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        /*
         * ---------------------------------
         * Never delete ADMIN
         * ---------------------------------
         */

        if (Role.ADMIN.equals(user.getRole())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "System administrator cannot be deleted"
            );
        }

        /*
         * =================================================
         * STEP 1
         *
         * DELETE INTERVIEWS
         * =================================================
         *
         * A user can have interviews because:
         *
         * 1. They are a JOB_SEEKER
         *
         * OR
         *
         * 2. They are a RECRUITER whose job
         *    has applications/interviews.
         */

        List<Interview> candidateInterviews =
                interviewRepository
                        .findByApplicationUserId(userId);

        List<Interview> recruiterInterviews =
                interviewRepository
                        .findByApplicationJobRecruiterId(
                                userId
                        );

        /*
         * Use Map to avoid deleting
         * the same interview twice.
         */

        Map<Long, Interview> interviews =
                new LinkedHashMap<>();

        for (Interview interview :
                candidateInterviews) {

            interviews.put(
                    interview.getId(),
                    interview
            );
        }

        for (Interview interview :
                recruiterInterviews) {

            interviews.put(
                    interview.getId(),
                    interview
            );
        }

        if (!interviews.isEmpty()) {

            interviewRepository.deleteAll(
                    interviews.values()
            );

            /*
             * Execute SQL now so FK problems
             * are detected before next step.
             */
            interviewRepository.flush();
        }

        /*
         * =================================================
         * STEP 2
         *
         * DELETE APPLICATIONS
         * =================================================
         */

        List<Application> candidateApplications =
                applicationRepository
                        .findByUserId(userId);

        List<Application> recruiterApplications =
                applicationRepository
                        .findByJobRecruiterId(userId);

        /*
         * Prevent duplicate application deletion.
         */

        Map<Long, Application> applications =
                new LinkedHashMap<>();

        for (Application application :
                candidateApplications) {

            applications.put(
                    application.getId(),
                    application
            );
        }

        for (Application application :
                recruiterApplications) {

            applications.put(
                    application.getId(),
                    application
            );
        }

        if (!applications.isEmpty()) {

            applicationRepository.deleteAll(
                    applications.values()
            );

            applicationRepository.flush();
        }

        /*
         * =================================================
         * STEP 3
         *
         * DELETE JOBS CREATED BY USER
         * =================================================
         */

        List<Job> recruiterJobs =
                jobRepository
                        .findByRecruiterId(userId);

        if (!recruiterJobs.isEmpty()) {

            jobRepository.deleteAll(
                    recruiterJobs
            );

            jobRepository.flush();
        }

        /*
         * =================================================
         * STEP 4
         *
         * DELETE USER
         * =================================================
         */

        userRepository.delete(user);

        userRepository.flush();
    }

    /*
     * =====================================================
     * FIND USER BY EMAIL
     * =====================================================
     */
    public User findByEmail(String email) {

        if (email == null ||
                email.isBlank()) {

            return null;
        }

        return userRepository
                .findByEmailIgnoreCase(
                        email.trim()
                )
                .orElse(null);
    }

    /*
     * =====================================================
     * GET ALL USERS
     * =====================================================
     */
    public List<User> findAll() {
        return userRepository.findAll();
    }
}