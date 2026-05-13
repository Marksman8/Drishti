package com.example.drishti.controller;

import com.example.drishti.entity.Course;
import com.example.drishti.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseRepository courseRepository;

    @GetMapping
    public ResponseEntity<List<Course>> list() {
        return ResponseEntity.ok(courseRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        course.setId(null);
        return ResponseEntity.ok(courseRepository.save(course));
    }
}
