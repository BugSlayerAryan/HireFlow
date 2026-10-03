package com.hireflow_ai_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(org.springframework.security.config.Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/api/auth/login", "/api/auth/register", "/ws-hireflow/**", "/uploads/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/jobs/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.DELETE, "/api/jobs/**").hasRole("RECRUITER")
                .requestMatchers("/api/applications/my", "/api/applications/apply/**").hasRole("JOB_SEEKER")
                .requestMatchers("/api/applications/recruiter", "/api/applications/*/status").hasRole("RECRUITER")
                .requestMatchers("/api/files/company-image", "/api/ai/generate-job-description").hasRole("RECRUITER")
                .requestMatchers("/api/ai/recommend", "/api/ai/match").hasRole("JOB_SEEKER")
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/dashboard/**", "/api/auth/user", "/api/auth/profile", "/api/files/profile-image", "/api/ai/**").authenticated()
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
