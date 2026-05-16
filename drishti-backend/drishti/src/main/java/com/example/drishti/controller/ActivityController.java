package com.example.drishti.controller;

import com.example.drishti.entity.ActivityLog;
import com.example.drishti.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogRepository repository;

    /** Any authenticated user records their own action (frontend gates this by cookie consent). */
    @PostMapping
    public ResponseEntity<Void> record(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {
        String action = body.get("action");
        if (action == null || action.isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        ActivityLog log = ActivityLog.builder()
                .userId(UUID.fromString(jwt.getSubject()))
                .userEmail(jwt.getClaimAsString("email"))
                .userRole(jwt.getClaimAsString("role"))
                .action(action)
                .detail(body.getOrDefault("detail", ""))
                .build();
        repository.save(log);
        return ResponseEntity.ok().build();
    }

    /** Admin-only: most recent activity across all users. */
    @GetMapping
    public ResponseEntity<List<ActivityLog>> list(
            @RequestParam(defaultValue = "100") int limit,
            @AuthenticationPrincipal Jwt jwt) {
        if (!"ADMIN".equalsIgnoreCase(jwt.getClaimAsString("role"))) {
            return ResponseEntity.status(403).build();
        }
        int capped = Math.min(Math.max(limit, 1), 500);
        return ResponseEntity.ok(
                repository.findAllByOrderByCreatedAtDesc(PageRequest.of(0, capped)).getContent());
    }
}
