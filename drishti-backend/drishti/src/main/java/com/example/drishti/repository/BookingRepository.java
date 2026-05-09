package com.example.drishti.repository;

import com.example.drishti.entity.BookingStatus;
import com.example.drishti.entity.CourseBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<CourseBooking, Long> {
    List<CourseBooking> findByOrgId(UUID orgId);
    List<CourseBooking> findByStatus(BookingStatus status);
}