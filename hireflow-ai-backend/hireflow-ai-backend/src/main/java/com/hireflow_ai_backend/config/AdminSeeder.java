package com.hireflow_ai_backend.config;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hireflow_ai_backend.entity.Role;
import com.hireflow_ai_backend.entity.User;
import com.hireflow_ai_backend.repository.UserRepository;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:}")
    private String adminEmail;

    @Value("${ADMIN_INITIAL_PASSWORD:}")
    private String adminPassword;

    public AdminSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        System.out.println("Starting Admin initialization...");

        if (adminEmail == null || adminEmail.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {

            System.out.println(
                    "Admin initialization skipped. ADMIN_EMAIL or ADMIN_INITIAL_PASSWORD missing."
            );

            return;
        }

        String normalizedEmail =
                adminEmail.trim().toLowerCase();

        Optional<User> existingAdmin =
                userRepository.findByEmailIgnoreCase(normalizedEmail);

        if (existingAdmin.isPresent()) {

            System.out.println(
                    "Admin already exists. Existing password was NOT changed."
            );

            return;
        }

        User admin = new User();

        admin.setName("System Admin");
        admin.setEmail(normalizedEmail);
        admin.setPassword(
                passwordEncoder.encode(adminPassword)
        );
        admin.setRole(Role.ADMIN);
        admin.setSkills("Admin, Security");

        userRepository.save(admin);

        System.out.println(
                "Initial admin account created successfully."
        );
    }
}