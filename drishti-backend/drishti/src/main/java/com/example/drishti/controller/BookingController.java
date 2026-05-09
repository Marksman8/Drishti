package com.example.drishti.controller;

import com.example.drishti.entity.CourseBooking;
import com.example.drishti.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<CourseBooking> createBooking(
            @RequestBody CourseBooking booking,
            @AuthenticationPrincipal Jwt jwt) {
        // Trust the JWT subject for orgId rather than the request body.
        booking.setOrgId(UUID.fromString(jwt.getSubject()));
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<CourseBooking>> getPendingBookings() {
        return ResponseEntity.ok(bookingService.getPendingBookings());
    }

    @PatchMapping("/approve/{id}")
    public ResponseEntity<CourseBooking> approveBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(bookingService.approveBooking(id, payload.get("meetingLink")));
    }

    @PatchMapping("/reject/{id}")
    public ResponseEntity<CourseBooking> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<CourseBooking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(bookingService.updateStatus(id, payload.get("status")));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseBooking>> getUserBookings(
            @PathVariable UUID userId,
            @AuthenticationPrincipal Jwt jwt) {
        // Only allow users to view their own bookings (or admins).
        UUID caller = UUID.fromString(jwt.getSubject());
        boolean isAdmin = jwt.getClaimAsStringList("authorities") != null
                && jwt.getClaimAsStringList("authorities").contains("ROLE_ADMIN");
        if (!caller.equals(userId) && !isAdmin) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(bookingService.getBookingsByOrgId(userId));
    }
}