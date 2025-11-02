package com.porikroma.repository;

import com.porikroma.dto.DestinationDto;
import java.util.List;
import java.util.Optional;

public interface DestinationRepository {
    
    List<DestinationDto> findAll();
    
    Optional<DestinationDto> findById(Long destinationId);
    
    List<DestinationDto> findByCountry(String country);
    
    List<DestinationDto> findByBudgetLevel(String budgetLevel);
    
    List<DestinationDto> findBySafetyRating(String safetyRating);
    
    List<DestinationDto> searchByName(String name);
    
    DestinationDto save(DestinationDto destination);
    
    DestinationDto update(Long destinationId, DestinationDto destination);
    
    void deleteById(Long destinationId);
    
    boolean existsById(Long destinationId);
    
    long count();
    
    // Advanced filtering
    List<DestinationDto> findAllWithFilters(String search, String country, String budgetLevel, int page, int size);
    
    // Related entities
    List<com.porikroma.dto.SubDestinationDto> findSubDestinationsByDestinationId(Long destinationId);
    List<com.porikroma.dto.AccommodationDto> findAccommodationsByDestinationId(Long destinationId);
    List<com.porikroma.dto.TransportDto> findTransportsByDestinationId(Long destinationId);
    
    // Additional methods for admin analytics
    long countAll();
    long countAllSubDestinations();
    long countAllAccommodations();
    
    // Filter options
    List<String> findDistinctCountries();
    List<String> findDistinctBudgetLevels();
}