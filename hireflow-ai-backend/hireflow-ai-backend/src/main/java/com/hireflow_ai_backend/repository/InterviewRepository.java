package com.hireflow_ai_backend.repository;

import com.hireflow_ai_backend.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT i FROM Interview i WHERE i.application.user.id = :userId")
    List<Interview> findByApplicationUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @org.springframework.data.jpa.repository.Query("SELECT i FROM Interview i WHERE i.application.job.recruiter.id = :recruiterId")
    List<Interview> findByApplicationJobRecruiterId(
            @org.springframework.data.repository.query.Param("recruiterId") Long recruiterId);
}
