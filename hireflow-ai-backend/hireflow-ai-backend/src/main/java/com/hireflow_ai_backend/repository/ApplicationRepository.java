package com.hireflow_ai_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hireflow_ai_backend.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);

    List<Application> findByJobRecruiterId(Long recruiterId);
}
