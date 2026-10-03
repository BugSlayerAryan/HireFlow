package com.hireflow_ai_backend.config;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🛠️ Starting Admin & Database Sync...");

        try {
            // 1. CLEAR DUPLICATES
            List<User> allUsers = userRepository.findAll();
            Set<String> seenEmails = new HashSet<>();
            for (User user : allUsers) {
                String email = user.getEmail().toLowerCase().trim();
                if (seenEmails.contains(email)) {
                    System.out.println("❌ Deleting duplicate: " + email);
                    userRepository.delete(user);
                } else {
                    seenEmails.add(email);
                }
            }

            // 2. FORCE ADMIN RESET
            String adminEmail = "admin@hireflow.com";
            Optional<User> adminOpt = userRepository.findByEmailIgnoreCase(adminEmail);

            User admin;
            if (adminOpt.isEmpty()) {
                System.out.println("✨ Creating fresh Admin: " + adminEmail);
                admin = new User();
                admin.setEmail(adminEmail);
                admin.setName("System Admin");
                admin.setRole(Role.ADMIN);
            } else {
                System.out.println("🔄 Resetting existing Admin password to admin123...");
                admin = adminOpt.get();
            }

            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setSkills("Admin, Security");
            userRepository.save(admin);

            // 3. SEED TEST USERS
            seedUserIfMissing("hariomjawarkar@gmail.com", "Hariom J", Role.JOB_SEEKER);
            seedUserIfMissing("hr@gmail.com", "HR Recruiter", Role.RECRUITER);

            System.out.println("✅ Database is ready.");
        } catch (Exception e) {
            System.err.println("❌ ERROR during Admin seeding: " + e.getMessage());
        }

        long count = userRepository.count();
        System.out.println("📊 Total users in database found: " + count);
        System.out.println("✅ Database sync complete.");
    }

    private void seedUserIfMissing(String email, String name, Role role) {
        if (userRepository.findByEmailIgnoreCase(email).isEmpty()) {
            User user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(role);
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setSkills("Java, Spring Boot, React");
            userRepository.save(user);
            System.out.println("✨ Created test user: " + email);
        }
    }
}
