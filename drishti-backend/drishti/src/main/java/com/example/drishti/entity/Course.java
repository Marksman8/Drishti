package com.example.drishti.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String professor;

    /** "General" or "Specialised" — kept open as a string for flexibility. */
    @Column(name = "course_type")
    private String type;

    @Column(length = 2000)
    private String description;

    /** YouTube link, Vimeo, or direct mp4 URL. Empty string = no video yet. */
    @Column(name = "video_url", length = 1000)
    private String videoUrl;

    /** Free-form, e.g. "8 weeks" or "2nd & 4th Saturdays". */
    private String duration;

    /** Comma-separated syllabus highlights. */
    @Column(length = 1000)
    private String syllabus;

    /** What a STUDENT gets / does on this course. Shown on the student-side detail page. */
    @Column(name = "student_info", length = 4000)
    private String studentInfo;

    /** What an INSTITUTION gets / what the visit covers. Shown on the institution-side detail page. */
    @Column(name = "institution_info", length = 4000)
    private String institutionInfo;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
