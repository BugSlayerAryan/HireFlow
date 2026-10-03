package com.hireflow_ai_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hireflow_ai_backend.entity.Job;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiterId(Long recruiterId);
}
