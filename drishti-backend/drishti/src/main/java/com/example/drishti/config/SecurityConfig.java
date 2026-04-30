package com.example.drishti.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/public/**").permitAll() // Home page, public reviews
                        .requestMatchers("/api/bookings/**").permitAll() // Allow booking endpoints for development
                        .requestMatchers("/api/chat/**").permitAll() // Allow chat endpoint
                        .requestMatchers("/api/student/**").hasAuthority("APPROLE_STUDENT")
                        .requestMatchers("/api/institution/**").hasAuthority("APPROLE_INSTITUTION")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth -> oauth.jwt(jwt -> {}));

        return http.build();
    }
}