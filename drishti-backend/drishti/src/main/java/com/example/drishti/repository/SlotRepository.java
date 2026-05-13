package com.example.drishti.repository;

import com.example.drishti.entity.CourseSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SlotRepository extends JpaRepository<CourseSlot, Long> {
    List<CourseSlot> findByBookedBy(UUID userId);
}
