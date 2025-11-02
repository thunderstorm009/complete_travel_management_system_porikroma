package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubDestinationDto {
    private Long subDestinationId;
    private Long destinationId;
    private String destinationName;
    private String subDestinationName;
    private String category;  // HISTORICAL, NATURAL, CULTURAL, ADVENTURE, RELIGIOUS, ENTERTAINMENT, SHOPPING, BEACH, MOUNTAIN
    private String description;
    private String featuredImage;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal entryFee;
    private String openingHours;
    private String contactPhone;
    private String contactEmail;
    private String websiteUrl;
    private BigDecimal durationHours;
    private String difficultyLevel;  // EASY, MODERATE, HARD, EXTREME
    private String accessibilityInfo;
    private String bestVisitTime;
    private String facilities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Trip-specific fields
    private BigDecimal estimatedCost;
    private String status;  // PLANNED, CONFIRMED, COMPLETED, SKIPPED
    private String notes;
}