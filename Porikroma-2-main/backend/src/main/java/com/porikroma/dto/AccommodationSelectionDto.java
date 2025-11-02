package com.porikroma.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccommodationSelectionDto {
    private Long accommodationId;
    private Long destinationId;
    private String accommodationName;
    private String accommodationType;
    private String description;
    private Double pricePerNight;
    private String currency;
    
    // We only need the accommodationId for the database insert
    // All other fields are ignored but accepted to prevent deserialization errors
}