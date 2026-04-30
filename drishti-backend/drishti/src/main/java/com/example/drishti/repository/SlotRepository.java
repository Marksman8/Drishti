package com.example.drishti.repository;

import com.example.drishti.entity.CourseSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SlotRepository extends JpaRepository<CourseSlot, Long> {
}