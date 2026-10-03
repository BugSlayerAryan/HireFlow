package com.hireflow_ai_backend.ai;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeMatchService {

    private final Tika tika = new Tika();
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String apiBaseUrl;

    @Value("${gemini.model:gemini-3.8-flash}")
    private String model;

    public String getAIChatResponse(String message, String role) {
        String prompt = "You are the HireFlow AI Assistant (Role: " + role + "). "
                + "Help the user with platform questions. User says: " + message;
        return callGemini(prompt);
    }

    public Map<String, Object> analyzeMatchFromFile(MultipartFile file, String jobSkills)
            throws IOException, TikaException {
        String content = tika.parseToString(file.getInputStream());
        return analyzeSemanticMatch(content, jobSkills);
    }

    public Map<String, Object> analyzeSemanticMatch(String resumeText, String jobSkills) {
        String prompt = "Compare this Resume with these Required Skills for a job match analysis.\n"
                + "Return ONLY a raw JSON object with these keys: "
                + "'score' (integer 0-100), "
                + "'matched' (list of strings found or semantically similar), "
                + "'missing' (list of strings from required skills but not in resume), "
                + "'summary' (brief 2 sentence explanation).\n\n"
                + "RESUME TEXT:\n" + resumeText + "\n\n"
                + "REQUIRED SKILLS:\n" + jobSkills;

        String response = callGemini(prompt).replaceAll("```json", "").replaceAll("```", "").trim();

        try {
            JSONObject json = new JSONObject(response);
            Map<String, Object> result = new HashMap<>();
            result.put("score", json.getInt("score"));

            List<String> matched = new ArrayList<>();
            JSONArray matchedArr = json.getJSONArray("matched");
            for (int i = 0; i < matchedArr.length(); i++)
                matched.add(matchedArr.getString(i));
            result.put("matched", matched);

            List<String> missing = new ArrayList<>();
            JSONArray missingArr = json.getJSONArray("missing");
            for (int i = 0; i < missingArr.length(); i++)
                missing.add(missingArr.getString(i));
            result.put("missing", missing);

            result.put("summary", json.getString("summary"));
            return result;
        } catch (Exception e) {
            System.err.println("Gemini Parsing Error: " + e.getMessage());
            return performKeywordMatch(resumeText, jobSkills);
        }
    }

    private String callGemini(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "HireFlow AI is not configured. Set the GEMINI_API_KEY environment variable on the backend.");
        }

        try {
            String url = apiBaseUrl + "/" + model + ":generateContent";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", apiKey);

            JSONObject body = new JSONObject();
            JSONArray contents = new JSONArray();
            JSONObject content = new JSONObject();
            JSONArray parts = new JSONArray();
            JSONObject part = new JSONObject();
            part.put("text", prompt);
            parts.put(part);
            content.put("role", "user");
            content.put("parts", parts);
            contents.put(content);
            body.put("contents", contents);

            JSONObject generationConfig = new JSONObject();
            generationConfig.put("temperature", 0.5);
            generationConfig.put("maxOutputTokens", 1200);
            body.put("generationConfig", generationConfig);

            HttpEntity<String> entity = new HttpEntity<>(body.toString(), headers);
            String response = restTemplate.postForObject(url, entity, String.class);
            if (response == null || response.isBlank()) {
                throw new IllegalStateException("Empty response from AI provider");
            }

            JSONObject resJson = new JSONObject(response);
            if (!resJson.has("candidates") || resJson.getJSONArray("candidates").isEmpty()) {
                throw new IllegalStateException("AI provider returned no candidates");
            }
            return resJson.getJSONArray("candidates")
                    .getJSONObject(0)
                    .getJSONObject("content")
                    .getJSONArray("parts")
                    .getJSONObject(0)
                    .getString("text");
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "AI assistant is temporarily unavailable. " + ex.getMessage(), ex);
        }
    }

    private Map<String, Object> performKeywordMatch(String resumeText, String jobSkills) {
        Map<String, Object> result = new HashMap<>();

        if (resumeText == null || jobSkills == null || jobSkills.trim().isEmpty()) {
            result.put("score", 0);
            result.put("matched", java.util.Collections.emptyList());
            result.put("missing", java.util.Collections.emptyList());
            result.put("summary", "No skills provided for analysis.");
            return result;
        }

        String normalizedResume = resumeText.toLowerCase();
        String[] requiredSkills = jobSkills.toLowerCase().split("\\s*,\\s*");

        List<String> matched = new java.util.ArrayList<>();
        List<String> missing = new java.util.ArrayList<>();

        for (String skill : requiredSkills) {
            String s = skill.trim();
            if (s.isEmpty())
                continue;

            String regex = "\\b" + java.util.regex.Pattern.quote(s) + "\\b";
            if (java.util.regex.Pattern.compile(regex).matcher(normalizedResume).find()
                    || normalizedResume.contains(s)) {
                matched.add(s);
            } else {
                missing.add(s);
            }
        }

        int baseScore = requiredSkills.length == 0 ? 0 : (int) ((double) matched.size() / requiredSkills.length * 100);
        result.put("score", baseScore);
        result.put("matched", matched);
        result.put("missing", missing);
        result.put("summary", "Basic keyword scan found " + matched.size() + " matches.");

        return result;
    }

    public int calculateMatch(String resumeSkills, String jobSkills) {
        Map<String, Object> analysis = analyzeSemanticMatch(resumeSkills, jobSkills);
        Object scoreObj = analysis.get("score");
        return (scoreObj instanceof Integer) ? (Integer) scoreObj : 0;
    }

    public String generateEnhancedJobDescription(String title, String currentDescription, String skills) {
        String prompt = "You are an expert technical recruiter. Based on the job title '" + title + "' "
                + "and required skills '" + skills + "', please rewrite and enhance this job description "
                + "to be professional, engaging, and clear. Include sections for Role Overview, Responsibilities, "
                + "and Key Requirements. "
                + (currentDescription != null && !currentDescription.isEmpty()
                        ? "\nCurrent draft: " + currentDescription
                        : "");

        return callGemini(prompt);
    }

    public String generateEnhancedBio(String name, String currentBio, String skills) {
        String prompt = "You are a professional career coach. Write a compelling, high-impact professional bio for "
                + name + " based on their technical skills: " + skills + ". "
                + "The bio should be about 3-4 sentences long, highlighting their expertise and value proposition. "
                + (currentBio != null && !currentBio.isEmpty()
                        ? "\nUse this as context for their background: " + currentBio
                        : "");

        return callGemini(prompt);
    }
}
