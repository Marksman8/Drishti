package com.example.drishti.controller;

import com.example.drishti.entity.CourseSlot;
import com.example.drishti.repository.SlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/slots")
public class CourseSlotController {

    @Autowired
    private SlotRepository slotRepository;

    @PostMapping("/book/{slotId}")
    public ResponseEntity<?> bookSlot(@PathVariable Long slotId, @AuthenticationPrincipal Jwt jwt) {
        // Get user ID from the Supabase JWT
        UUID userId = UUID.fromString(jwt.getSubject());

        return slotRepository.findById(slotId).map(slot -> {
            if (Boolean.TRUE.equals(slot.getIsBooked())) {
                return ResponseEntity.badRequest().body("Slot already taken");
            }

            slot.setIsBooked(true);
            slot.setBookedBy(userId);
            slotRepository.save(slot);
            return ResponseEntity.ok("Booking confirmed!");
        }).orElse(ResponseEntity.notFound().build());
    }
}