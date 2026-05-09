package com.example.drishti.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "course_bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private UUID orgId;

    @Column(nullable = false)
    private String schoolName;

    @Column(nullable = false)
    private String courseName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @Column
    private String meetingLink;

    @Column
    private String approvedDate;

    @Column
    private String venueType;

    @Column
    private String studentCount;

    @Column
    private String preferredDates;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}