package com.example.drishti.controller;

import com.example.drishti.entity.Course;
import com.example.drishti.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseRepository courseRepository;

    /** Public: list every course. */
    @GetMapping
    public ResponseEntity<List<Course>> list() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    /** Public: single course (for the detail page). */
    @GetMapping("/{id}")
    public ResponseEntity<Course> get(@PathVariable Long id) {
        return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    /** Admin only. */
    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course, @AuthenticationPrincipal Jwt jwt) {
        requireAdmin(jwt);
        course.setId(null);
        return ResponseEntity.ok(courseRepository.save(course));
    }

    /** Admin only. */
    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course body,
                                         @AuthenticationPrincipal Jwt jwt) {
        requireAdmin(jwt);
        Course existing = courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
        existing.setTitle(body.getTitle());
        existing.setProfessor(body.getProfessor());
        existing.setType(body.getType());
        existing.setDescription(body.getDescription());
        existing.setVideoUrl(body.getVideoUrl());
        existing.setDuration(body.getDuration());
        existing.setSyllabus(body.getSyllabus());
        existing.setStudentInfo(body.getStudentInfo());
        existing.setInstitutionInfo(body.getInstitutionInfo());
        return ResponseEntity.ok(courseRepository.save(existing));
    }

    /** Admin only. */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        requireAdmin(jwt);
        if (!courseRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found");
        }
        courseRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void requireAdmin(Jwt jwt) {
        if (!"ADMIN".equalsIgnoreCase(jwt.getClaimAsString("role"))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin only");
        }
    }
}
