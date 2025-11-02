package com.porikroma.service;

import com.porikroma.dto.UserDto;
import com.porikroma.dto.DestinationDto;
import com.porikroma.dto.TripDto;
import com.porikroma.repository.UserRepository;
import com.porikroma.repository.DestinationRepository;
import com.porikroma.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DestinationRepository destinationRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        // User statistics
        long totalUsers = userRepository.countActiveUsers();
        long newUsersThisMonth = userRepository.countNewUsersThisMonth();
        double userGrowth = userRepository.calculateUserGrowthPercentage();
        
        // Trip statistics
        long activeTrips = tripRepository.countActiveTrips();
        long totalTrips = tripRepository.countAllTrips();
        double tripGrowth = tripRepository.calculateTripGrowthPercentage();
        
        // Destination statistics
        long totalDestinations = destinationRepository.countAll();
        
        // Calculate actual revenue from expenses
        String revenueSql = "SELECT COALESCE(SUM(amount), 0) FROM trip_expenses WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
        BigDecimal revenueDecimal = jdbcTemplate.queryForObject(revenueSql, BigDecimal.class);
        long totalRevenue = revenueDecimal != null ? revenueDecimal.longValue() : 0L;
        
        analytics.put("totalUsers", totalUsers);
        analytics.put("newUsersThisMonth", newUsersThisMonth);
        analytics.put("userGrowth", userGrowth);
        analytics.put("activeTrips", activeTrips);
        analytics.put("totalTrips", totalTrips);
        analytics.put("tripGrowth", tripGrowth);
        analytics.put("totalDestinations", totalDestinations);
        analytics.put("totalRevenue", totalRevenue);
        
        return analytics;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll();
    }

    public void promoteUser(Long userId) {
        UserDto user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole("ADMIN");
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.updateUser(user);
    }

    public void demoteUser(Long userId) {
        UserDto user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole("TRAVELLER");
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.updateUser(user);
    }

    public void deleteUser(Long userId) {
        userRepository.softDelete(userId);
    }

    public Map<String, Object> getUserStats(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        UserDto user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Get user's trip statistics
        List<TripDto> userTrips = tripRepository.findByUserId(userId);
        long completedTrips = userTrips.stream()
            .filter(trip -> "COMPLETED".equals(trip.getStatus()))
            .count();
        
        stats.put("user", user);
        stats.put("totalTrips", userTrips.size());
        stats.put("completedTrips", completedTrips);
        stats.put("joinDate", user.getCreatedAt());
        
        return stats;
    }

    public List<DestinationDto> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public DestinationDto createDestination(DestinationDto destinationDto) {
        destinationDto.setCreatedAt(LocalDateTime.now());
        destinationDto.setUpdatedAt(LocalDateTime.now());
        return destinationRepository.save(destinationDto);
    }

    public DestinationDto updateDestination(Long destinationId, DestinationDto destinationDto) {
        // Validate destination exists (throws exception if not found)
        destinationRepository.findById(destinationId)
            .orElseThrow(() -> new RuntimeException("Destination not found"));
        
        destinationDto.setDestinationId(destinationId);
        destinationDto.setUpdatedAt(LocalDateTime.now());
        return destinationRepository.update(destinationId, destinationDto);
    }

    public void deleteDestination(Long destinationId) {
        destinationRepository.deleteById(destinationId);
    }

    public List<TripDto> getAllTrips() {
        return tripRepository.findAll();
    }

    public Map<String, Object> getTripStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalTrips = tripRepository.countAllTrips();
        long activeTrips = tripRepository.countActiveTrips();
        long completedTrips = tripRepository.countCompletedTrips();
        
        stats.put("totalTrips", totalTrips);
        stats.put("activeTrips", activeTrips);
        stats.put("completedTrips", completedTrips);
        
        return stats;
    }

    public Map<String, Object> getContentStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalDestinations = destinationRepository.countAll();
        long totalSubDestinations = destinationRepository.countAllSubDestinations();
        long totalAccommodations = destinationRepository.countAllAccommodations();
        
        stats.put("totalDestinations", totalDestinations);
        stats.put("totalSubDestinations", totalSubDestinations);
        stats.put("totalAccommodations", totalAccommodations);
        
        return stats;
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        
        // Actual system health checks
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            health.put("status", "healthy");
            health.put("database", "connected");
        } catch (Exception e) {
            health.put("status", "unhealthy");
            health.put("database", "disconnected");
        }
        health.put("lastUpdated", LocalDateTime.now());
        
        return health;
    }
}