package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DestinationDto {
    private Long destinationId;
    private String destinationName;
    private String country;
    private String stateProvince;
    private String city;
    private String description;
    private String featuredImage;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String bestVisitTime;
    private String weatherInfo;
    private String localLanguage;
    private String currency;
    private String timeZone;
    private String entryRequirements;
    private String safetyRating;  // VERY_SAFE, SAFE, MODERATE, CAUTION, AVOID
    private String budgetLevel;  // BUDGET, MID_RANGE, LUXURY, PREMIUM
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for detailed views
    private List<SubDestinationDto> subDestinations;
    private List<AccommodationDto> accommodations;
    private List<TransportDto> transports;
    private List<ReviewDto> reviews;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer tripCount;
}