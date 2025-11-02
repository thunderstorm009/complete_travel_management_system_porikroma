package com.porikroma.controller;
import com.porikroma.dto.DestinationDto;
import com.porikroma.dto.SubDestinationDto;
import com.porikroma.dto.AccommodationDto;
import com.porikroma.dto.TransportDto;
import com.porikroma.service.DestinationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/destinations")
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public ResponseEntity<List<DestinationDto>> getAllDestinations(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String budgetLevel,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            HttpServletRequest request) {
        // Authenticated users can browse destinations
        List<DestinationDto> destinations = destinationService.getAllDestinations(search, country, budgetLevel, page, size);
        return ResponseEntity.ok(destinations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationDto> getDestinationById(@PathVariable Long id, HttpServletRequest request) {
        // Authenticated users can view destination details
        DestinationDto destination = destinationService.getDestinationById(id);
        return ResponseEntity.ok(destination);
    }

    @GetMapping("/{destinationId}/sub-destinations")
    public ResponseEntity<List<SubDestinationDto>> getSubDestinations(@PathVariable Long destinationId, HttpServletRequest request) {
        // Authenticated users can view sub-destinations
        List<SubDestinationDto> subDestinations = destinationService.getSubDestinations(destinationId);
        return ResponseEntity.ok(subDestinations);
    }

    @GetMapping("/{destinationId}/accommodations")
    public ResponseEntity<List<AccommodationDto>> getAccommodations(@PathVariable Long destinationId, HttpServletRequest request) {
        // Authenticated users can view accommodations
        List<AccommodationDto> accommodations = destinationService.getAccommodations(destinationId);
        return ResponseEntity.ok(accommodations);
    }

    @GetMapping("/{destinationId}/transports")
    public ResponseEntity<List<TransportDto>> getTransports(@PathVariable Long destinationId, HttpServletRequest request) {
        // Authenticated users can view transport options
        List<TransportDto> transports = destinationService.getTransports(destinationId);
        return ResponseEntity.ok(transports);
    }

    @GetMapping("/filters/countries")
    public ResponseEntity<List<String>> getAvailableCountries(HttpServletRequest request) {
        // Get all unique countries from destinations
        List<String> countries = destinationService.getAvailableCountries();
        return ResponseEntity.ok(countries);
    }

    @GetMapping("/filters/budget-levels")
    public ResponseEntity<List<String>> getAvailableBudgetLevels(HttpServletRequest request) {
        // Get all unique budget levels from destinations
        List<String> budgetLevels = destinationService.getAvailableBudgetLevels();
        return ResponseEntity.ok(budgetLevels);
    }
}