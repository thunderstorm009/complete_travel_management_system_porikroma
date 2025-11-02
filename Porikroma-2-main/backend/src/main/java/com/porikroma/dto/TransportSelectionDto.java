package com.porikroma.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransportSelectionDto {
    private Long transportId;
    private Long destinationId;
    private String transportType;
    private String operatorName;
    private String routeFrom;
    private String routeTo;
    private Integer durationMinutes;
    private Double price;
    private String currency;
    
    // We only need the transportId for the database insert
    // All other fields are ignored but accepted to prevent deserialization errors
}