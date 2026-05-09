package com.example.drishti.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Data
public class User {
    @Id
    private UUID id; // Matches the Supabase Auth User ID

    @Column(unique = true)
    private String username; // Optional; populated post-signup

    @Column(name = "full_name")
    private String fullName;

    private String role; // 'STUDENT', 'INSTITUTION', or 'ADMIN'
}