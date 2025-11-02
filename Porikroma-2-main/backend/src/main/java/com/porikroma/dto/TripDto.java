package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDto {
    private Long tripId;
    private String tripName;
    private Long destinationId;
    private String destinationName;
    private Long creatorUserId;
    private String creatorName;
    private String tripPhotoUrl;
    private BigDecimal tripBudget;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;  // PLANNING, CONFIRMED, ONGOING, COMPLETED, CANCELLED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Additional fields for detailed views
    private List<TripMemberDto> members;
    private List<SubDestinationDto> subDestinations;
    private List<AccommodationDto> accommodations;
    private List<TransportDto> transports;
    private List<ExpenseDto> expenses;
    private BigDecimal totalExpenses;
    private int memberCount;
}