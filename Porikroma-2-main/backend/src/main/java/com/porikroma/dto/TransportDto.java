package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransportDto {
    private Long transportId;
    private Long destinationId;
    private String destinationName;
    private String transportType;  // BUS, TRAIN, FLIGHT, CAR_RENTAL, BOAT, MOTORCYCLE
    private String operatorName;
    private String routeFrom;
    private String routeTo;
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private Integer durationMinutes;
    private BigDecimal price;
    private String currency;
    private String seatTypes;
    private String amenities;
    private String bookingInfo;
    private String contactPhone;
    private String contactEmail;
    private String websiteUrl;
    private String frequency;
    private String seasonalAvailability;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Trip-specific fields
    private String journeyType;  // TO_DESTINATION, FROM_DESTINATION, LOCAL_TRANSPORT
    private LocalDate travelDate;
    private LocalTime tripDepartureTime;
    private LocalTime tripArrivalTime;
    private Integer numberOfPassengers;
    private String seatPreference;
    private BigDecimal totalCost;
    private String bookingStatus;  // PLANNED, BOOKED, CONFIRMED, CANCELLED
    private String bookingReference;
}