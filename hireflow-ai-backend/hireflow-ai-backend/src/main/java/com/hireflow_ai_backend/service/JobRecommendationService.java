package com.hireflow_ai_backend.service;

import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.hireflow_ai_backend.entity.Job;

@Service
public class JobRecommendationService {

    public List<Job> recommend(String userSkills, List<Job> jobs) {
        if (jobs == null || jobs.isEmpty())
            return new ArrayList<>();

        if (userSkills == null || userSkills.trim().isEmpty()) {
            return jobs.stream().limit(10).collect(Collectors.toList());
        }

        java.util.Set<String> userSkillSet = java.util.Arrays.stream(userSkills.toLowerCase().split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(java.util.stream.Collectors.toSet());

        return jobs.stream()
                .sorted((a, b) -> Integer.compare(
                        countMatch(userSkillSet, b.getSkillsRequired()),
                        countMatch(userSkillSet, a.getSkillsRequired())))
                .limit(10)
                .collect(Collectors.toList());
    }

    private int countMatch(java.util.Set<String> userSkills, String jobSkills) {
        if (jobSkills == null || jobSkills.trim().isEmpty())
            return 0;

        return (int) java.util.Arrays.stream(jobSkills.toLowerCase().split(","))
                .map(String::trim)
                .filter(userSkills::contains)
                .count();
    }
}
