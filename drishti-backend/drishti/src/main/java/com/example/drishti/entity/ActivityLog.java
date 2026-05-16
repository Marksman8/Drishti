package com.example.drishti.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "activity_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID userId;

    private String userEmail;

    private String userRole;

    @Column(nullable = false)
    private String action;

    @Column(length = 500)
    private String detail;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
