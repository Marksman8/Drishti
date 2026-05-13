package com.example.drishti.controller;

import com.example.drishti.entity.CourseSlot;
import com.example.drishti.repository.SlotRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/slots")
public class CourseSlotController {

    @Autowired
    private SlotRepository slotRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping
    public ResponseEntity<List<CourseSlot>> listAll() {
        return ResponseEntity.ok(slotRepository.findAll());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseSlot>> listForUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal Jwt jwt) {
        UUID caller = UUID.fromString(jwt.getSubject());
        if (!caller.equals(userId)) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(slotRepository.findByBookedBy(userId));
    }

    @PostMapping
    public ResponseEntity<CourseSlot> create(@RequestBody CourseSlot slot) {
        slot.setId(null);
        if (slot.getIsBooked() == null) slot.setIsBooked(false);
        return ResponseEntity.ok(slotRepository.save(slot));
    }

    @PostMapping("/book/{slotId}")
    @Transactional
    public ResponseEntity<?> bookSlot(@PathVariable Long slotId, @AuthenticationPrincipal Jwt jwt) {
        UUID userId = UUID.fromString(jwt.getSubject());

        CourseSlot slot = entityManager.find(CourseSlot.class, slotId, LockModeType.PESSIMISTIC_WRITE);
        if (slot == null) {
            return ResponseEntity.notFound().build();
        }
        if (Boolean.TRUE.equals(slot.getIsBooked())) {
            return ResponseEntity.badRequest().body("Slot already taken");
        }

        slot.setIsBooked(true);
        slot.setBookedBy(userId);
        slotRepository.save(slot);
        return ResponseEntity.ok("Booking confirmed!");
    }
}
