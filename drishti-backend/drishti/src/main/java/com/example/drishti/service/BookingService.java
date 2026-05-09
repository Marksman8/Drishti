package com.example.drishti.service;

import com.example.drishti.entity.BookingStatus;
import com.example.drishti.entity.CourseBooking;
import com.example.drishti.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    public CourseBooking createBooking(CourseBooking booking) {
        booking.setStatus(BookingStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public List<CourseBooking> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    public CourseBooking approveBooking(Long id, String meetingLink) {
        CourseBooking booking = findOrThrow(id);
        booking.setStatus(BookingStatus.APPROVED);
        booking.setMeetingLink(meetingLink);
        booking.setApprovedDate(LocalDate.now().toString());
        return bookingRepository.save(booking);
    }

    public CourseBooking rejectBooking(Long id) {
        CourseBooking booking = findOrThrow(id);
        booking.setStatus(BookingStatus.REJECTED);
        return bookingRepository.save(booking);
    }

    public CourseBooking updateStatus(Long id, String status) {
        BookingStatus parsed;
        try {
            parsed = BookingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status: " + status);
        }
        CourseBooking booking = findOrThrow(id);
        booking.setStatus(parsed);
        if (parsed == BookingStatus.APPROVED) {
            booking.setApprovedDate(LocalDate.now().toString());
        }
        return bookingRepository.save(booking);
    }

    public List<CourseBooking> getBookingsByOrgId(UUID orgId) {
        return bookingRepository.findByOrgId(orgId);
    }

    private CourseBooking findOrThrow(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found: " + id));
    }
}