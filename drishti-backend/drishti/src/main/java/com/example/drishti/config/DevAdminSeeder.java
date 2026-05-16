package com.example.drishti.config;

import com.example.drishti.entity.User;
import com.example.drishti.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DevAdminSeeder {

    private static final Logger log = LoggerFactory.getLogger(DevAdminSeeder.class);
    private static final String ADMIN_EMAIL = "drishtidev@gmail.com";
    private static final String ADMIN_PASSWORD = "drishti123";
    private static final String ADMIN_NAME = "Drishti Admin";

    @Bean
    CommandLineRunner seedDevAdminRunner(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> userRepository.findByEmail(ADMIN_EMAIL).ifPresentOrElse(
            existing -> {
                boolean changed = false;
                if (!"ADMIN".equals(existing.getRole())) {
                    existing.setRole("ADMIN");
                    changed = true;
                }
                if (!existing.isEmailVerified()) {
                    existing.setEmailVerified(true);
                    changed = true;
                }
                if (!existing.isPhoneVerified()) {
                    existing.setPhoneVerified(true);
                    changed = true;
                }
                if (changed) {
                    userRepository.save(existing);
                    log.info("Updated dev admin account: {}", ADMIN_EMAIL);
                }
            },
            () -> {
                User admin = new User();
                admin.setEmail(ADMIN_EMAIL);
                admin.setPasswordHash(passwordEncoder.encode(ADMIN_PASSWORD));
                admin.setFullName(ADMIN_NAME);
                admin.setRole("ADMIN");
                admin.setEmailVerified(true);
                admin.setPhoneVerified(true);
                admin.setAuthProvider("LOCAL");
                userRepository.save(admin);
                log.info("Seeded dev admin account: {}", ADMIN_EMAIL);
            }
        );
    }
}
