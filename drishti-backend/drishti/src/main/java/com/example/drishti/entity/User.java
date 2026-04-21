package com.example.drishti.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Data
public class User {
    @Id
    private UUID id; // This matches the Supabase Auth User ID

    @Column(unique = true)
    private String username;

    @Column(name = "full_name")
    private String fullName;

    private String role; // 'STUDENT' or 'INSTITUTION'
}