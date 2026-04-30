package com.example.drishti.controller;

import com.example.drishti.entity.User;
import com.example.drishti.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.example.drishti.dto.BatchRequest;

import java.util.UUID;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public User getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        // Extract the user ID from the Supabase JWT
        UUID userId = UUID.fromString(jwt.getSubject());
        return userRepository.findById(userId).orElse(null);
    }

    @PostMapping("/book-slot")
    public ResponseEntity<?> bookSlot(@RequestBody BatchRequest request, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok("Booking request sent!");
    }
}