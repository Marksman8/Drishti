package com.example.drishti.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class BatchRequest {
    private Long courseId;
    private String venueType;
    private Integer studentCount;
    private List<LocalDate> preferredDates;
}