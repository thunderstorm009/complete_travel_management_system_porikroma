package com.porikroma.repository;

import com.porikroma.dto.TripDto;
import com.porikroma.dto.TripMemberDto;
import com.porikroma.dto.TripInvitationDto;
import java.util.List;
import java.util.Optional;

public interface TripRepository {
    
    List<TripDto> findAll();
    
    Optional<TripDto> findById(Long tripId);
    
    List<TripDto> findByUserId(Long userId);
    
    List<TripDto> findByDestinationId(Long destinationId);
    
    List<TripDto> findByStatus(String status);
    
    List<TripDto> findPublicTrips();
    
    List<TripDto> findByDateRange(String startDate, String endDate);
    
    TripDto save(TripDto trip);
    
    TripDto update(Long tripId, TripDto trip);
    
    void deleteById(Long tripId);
    
    boolean existsById(Long tripId);
    
    long count();
    
    long countByStatus(String status);
    
    List<TripDto> findPopularTrips(int limit);
    
    List<TripDto> findRecentTrips(int limit);
    
    // Additional methods for admin analytics and trip functionality
    long countActiveTrips();
    long countAllTrips();
    long countCompletedTrips();
    double calculateTripGrowthPercentage();
    
    // Trip member management
    void addMember(TripMemberDto member);
    List<TripMemberDto> findMembersByTripId(Long tripId);
    boolean isUserTripMember(Long tripId, Long userId);
    
    // Trip invitation management
    TripInvitationDto saveInvitation(TripInvitationDto invitation);
    Optional<TripInvitationDto> findInvitationById(Long invitationId);
    void updateInvitation(TripInvitationDto invitation);
    List<TripInvitationDto> findInvitationsByUserId(Long userId);
    boolean hasUserInvitation(Long tripId, Long userId);
    
    // Trip features
    void addSubDestinations(Long tripId, List<Long> subDestinationIds);
    void addAccommodations(Long tripId, List<Long> accommodationIds);
    void addTransports(Long tripId, List<Long> transportIds);
    
    // Trip data retrieval
    List<com.porikroma.dto.SubDestinationDto> findSubDestinationsByTripId(Long tripId);
    List<com.porikroma.dto.AccommodationDto> findAccommodationsByTripId(Long tripId);
    List<com.porikroma.dto.TransportDto> findTransportsByTripId(Long tripId);
    List<com.porikroma.dto.ExpenseDto> findExpensesByTripId(Long tripId);
    long countMembersByTripId(Long tripId);
    java.math.BigDecimal getTotalExpensesByTripId(Long tripId);
}