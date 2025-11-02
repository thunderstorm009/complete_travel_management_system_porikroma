package com.porikroma.controller;

import com.porikroma.dto.UserDto;
import com.porikroma.dto.DestinationDto;
import com.porikroma.dto.TripDto;
import com.porikroma.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = adminService.getAnalytics();
        return ResponseEntity.ok(analytics);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/users/{userId}/promote")
    public ResponseEntity<Void> promoteUser(@PathVariable Long userId) {
        adminService.promoteUser(userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{userId}/demote")
    public ResponseEntity<Void> demoteUser(@PathVariable Long userId) {
        adminService.demoteUser(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable Long userId) {
        Map<String, Object> stats = adminService.getUserStats(userId);
        return ResponseEntity.ok(stats);
    }

    // Destination Management
    @GetMapping("/destinations")
    public ResponseEntity<List<DestinationDto>> getAllDestinations() {
        List<DestinationDto> destinations = adminService.getAllDestinations();
        return ResponseEntity.ok(destinations);
    }

    @PostMapping("/destinations")
    public ResponseEntity<DestinationDto> createDestination(@RequestBody DestinationDto destinationDto) {
        DestinationDto createdDestination = adminService.createDestination(destinationDto);
        return ResponseEntity.ok(createdDestination);
    }

    @PutMapping("/destinations/{destinationId}")
    public ResponseEntity<DestinationDto> updateDestination(
            @PathVariable Long destinationId,
            @RequestBody DestinationDto destinationDto) {
        DestinationDto updatedDestination = adminService.updateDestination(destinationId, destinationDto);
        return ResponseEntity.ok(updatedDestination);
    }

    @DeleteMapping("/destinations/{destinationId}")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long destinationId) {
        adminService.deleteDestination(destinationId);
        return ResponseEntity.ok().build();
    }

    // Trip Management
    @GetMapping("/trips")
    public ResponseEntity<List<TripDto>> getAllTrips() {
        List<TripDto> trips = adminService.getAllTrips();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/stats")
    public ResponseEntity<Map<String, Object>> getTripStats() {
        Map<String, Object> stats = adminService.getTripStats();
        return ResponseEntity.ok(stats);
    }

    // Content Management
    @GetMapping("/content/stats")
    public ResponseEntity<Map<String, Object>> getContentStats() {
        Map<String, Object> stats = adminService.getContentStats();
        return ResponseEntity.ok(stats);
    }

    // System Health
    @GetMapping("/system/health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        Map<String, Object> health = adminService.getSystemHealth();
        return ResponseEntity.ok(health);
    }
}