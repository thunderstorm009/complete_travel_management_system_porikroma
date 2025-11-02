package com.porikroma.service;

import com.porikroma.dto.DestinationDto;
import com.porikroma.dto.SubDestinationDto;
import com.porikroma.dto.AccommodationDto;
import com.porikroma.dto.TransportDto;
import com.porikroma.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DestinationService {

    @Autowired
    private DestinationRepository destinationRepository;

    public List<DestinationDto> getAllDestinations(String search, String country, String budgetLevel, int page, int size) {
        return destinationRepository.findAllWithFilters(search, country, budgetLevel, page, size);
    }

    public DestinationDto getDestinationById(Long id) {
        return destinationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Destination not found"));
    }

    public List<SubDestinationDto> getSubDestinations(Long destinationId) {
        return destinationRepository.findSubDestinationsByDestinationId(destinationId);
    }

    public List<AccommodationDto> getAccommodations(Long destinationId) {
        return destinationRepository.findAccommodationsByDestinationId(destinationId);
    }

    public List<TransportDto> getTransports(Long destinationId) {
        return destinationRepository.findTransportsByDestinationId(destinationId);
    }

    // Admin methods (used by AdminService)
    public DestinationDto createDestination(DestinationDto destinationDto) {
        return destinationRepository.save(destinationDto);
    }

    public DestinationDto updateDestination(Long id, DestinationDto destinationDto) {
        // Validate destination exists (throws exception if not found)
        getDestinationById(id);
        destinationDto.setDestinationId(id);
        return destinationRepository.update(id, destinationDto);
    }

    public void deleteDestination(Long id) {
        destinationRepository.deleteById(id);
    }

    public List<String> getAvailableCountries() {
        return destinationRepository.findDistinctCountries();
    }

    public List<String> getAvailableBudgetLevels() {
        return destinationRepository.findDistinctBudgetLevels();
    }
}