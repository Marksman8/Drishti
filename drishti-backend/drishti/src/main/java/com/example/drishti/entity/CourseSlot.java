package com.example.drishti.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "course_slots")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "is_booked")
    @Builder.Default
    private Boolean isBooked = false;

    @Column(name = "booked_by")
    private UUID bookedBy;

    @Column(name = "course_name")
    private String courseName;

    @Column(name = "slot_date")
    private String slotDate;

    @Column(name = "slot_time")
    private String slotTime;

    @Column(name = "meeting_link")
    private String meetingLink;
}