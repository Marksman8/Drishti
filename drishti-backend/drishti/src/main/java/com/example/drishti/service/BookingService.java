package com.example.drishti.service;

import com.example.drishti.entity.CourseBooking;
import com.example.drishti.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public CourseBooking createBooking(CourseBooking booking) {
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public List<CourseBooking> getPendingBookings() {
        return bookingRepository.findByStatus("PENDING");
    }

    public CourseBooking approveBooking(Long id, String meetingLink) {
        CourseBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus("APPROVED");
        booking.setMeetingLink(meetingLink);
        booking.setApprovedDate(LocalDate.now().toString());
        return bookingRepository.save(booking);
    }

    public CourseBooking rejectBooking(Long id) {
        CourseBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus("REJECTED");
        return bookingRepository.save(booking);
    }

    public CourseBooking updateStatus(Long id, String status) {
        CourseBooking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setStatus(status);
        if ("APPROVED".equals(status)) {
            booking.setApprovedDate(LocalDate.now().toString());
        }
        return bookingRepository.save(booking);
    }

    public List<CourseBooking> getBookingsByUserId(UUID userId) {
        // We use orgId to map userId since no separate userId was specified in the entity.
        return bookingRepository.findByOrgId(userId);
    }
}