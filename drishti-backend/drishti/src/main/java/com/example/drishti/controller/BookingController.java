package com.example.drishti.controller;

import com.example.drishti.entity.CourseBooking;
import com.example.drishti.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<CourseBooking> createBooking(@RequestBody CourseBooking booking) {
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
        String meetingLink = payload.get("meetingLink");
        return ResponseEntity.ok(bookingService.approveBooking(id, meetingLink));
    }

    @PatchMapping("/reject/{id}")
    public ResponseEntity<CourseBooking> rejectBooking(@PathVariable Long id) {
        return ResponseEntity.ok(bookingService.rejectBooking(id));
    }

    @PatchMapping("/status/{id}")
    public ResponseEntity<CourseBooking> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseBooking>> getUserBookings(@PathVariable UUID userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(userId));
    }
}