package com.example.drishti.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Data
public class User {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(unique = true)
    private String username;

    @Column(name = "full_name")
    private String fullName;

    private String role;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "phone_verified", nullable = false)
    private boolean phoneVerified = false;

    @Column(name = "auth_provider")
    private String authProvider; // "LOCAL" or "GOOGLE"

    @JsonIgnore
    @Column(name = "verification_token")
    private String verificationToken;

    @JsonIgnore
    @Column(name = "verification_token_expires_at")
    private Instant verificationTokenExpiresAt;

    @JsonIgnore
    @Column(name = "reset_token")
    private String resetToken;

    @JsonIgnore
    @Column(name = "reset_token_expires_at")
    private Instant resetTokenExpiresAt;
}
