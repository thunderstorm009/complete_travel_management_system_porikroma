package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccommodationDto {
    private Long accommodationId;
    private Long destinationId;
    private String destinationName;
    private String accommodationName;
    private String accommodationType;  // HOTEL, RESORT, GUESTHOUSE, HOSTEL, APARTMENT, VILLA, COTTAGE
    private String description;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String contactPhone;
    private String contactEmail;
    private String websiteUrl;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private BigDecimal pricePerNight;
    private String currency;
    private String amenities;
    private String roomTypes;
    private String cancellationPolicy;
    private List<String> photos;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Trip-specific fields
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfRooms;
    private String roomType;
    private BigDecimal totalCost;
    private String bookingStatus;  // PLANNED, BOOKED, CONFIRMED, CANCELLED
    private String bookingReference;
    private String specialRequests;
}