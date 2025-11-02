package com.porikroma.controller;

import com.porikroma.dto.TripDto;
import com.porikroma.dto.TripMemberDto;
import com.porikroma.dto.TripInvitationDto;
import com.porikroma.service.TripService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping
public class TripController {

    @Autowired
    private TripService tripService;

    @GetMapping("/users/me/trips")
    public ResponseEntity<List<TripDto>> getUserTrips(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<TripDto> trips = tripService.getUserTrips(userId);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/trips/{tripId}")
    public ResponseEntity<TripDto> getTripById(@PathVariable Long tripId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // Check if user is a member of this trip OR has a pending invitation
        if (!tripService.isUserTripMember(tripId, userId) && !tripService.hasUserInvitation(tripId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        TripDto trip = tripService.getTripById(tripId);
        return ResponseEntity.ok(trip);
    }

    @PostMapping("/trips")
    public ResponseEntity<TripDto> createTrip(
            @RequestBody TripDto tripDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        tripDto.setCreatorUserId(userId);
        TripDto createdTrip = tripService.createTrip(tripDto);
        return ResponseEntity.ok(createdTrip);
    }

    @PutMapping("/trips/{tripId}")
    public ResponseEntity<TripDto> updateTrip(
            @PathVariable Long tripId,
            @RequestBody TripDto tripDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        TripDto updatedTrip = tripService.updateTrip(tripId, tripDto, userId);
        return ResponseEntity.ok(updatedTrip);
    }

    @DeleteMapping("/trips/{tripId}")
    public ResponseEntity<Void> deleteTrip(
            @PathVariable Long tripId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        tripService.deleteTrip(tripId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/trips/{tripId}/members")
    public ResponseEntity<List<TripMemberDto>> getTripMembers(@PathVariable Long tripId) {
        List<TripMemberDto> members = tripService.getTripMembers(tripId);
        return ResponseEntity.ok(members);
    }

    @PostMapping("/trips/{tripId}/invite")
    public ResponseEntity<TripInvitationDto> inviteToTrip(
            @PathVariable Long tripId,
            @RequestBody TripInvitationDto invitationDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        invitationDto.setTripId(tripId);
        invitationDto.setInviterUserId(userId);
        TripInvitationDto invitation = tripService.inviteUserToTrip(invitationDto);
        return ResponseEntity.ok(invitation);
    }

    @PostMapping("/invitations/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable Long invitationId,
            HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            System.out.println("DEBUG: acceptInvitation - invitationId: " + invitationId + ", userId: " + userId);
            tripService.respondToInvitation(invitationId, userId, true);
            System.out.println("DEBUG: acceptInvitation completed successfully");
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("ERROR in acceptInvitation: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PostMapping("/invitations/{invitationId}/decline")
    public ResponseEntity<Void> declineInvitation(
            @PathVariable Long invitationId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        tripService.respondToInvitation(invitationId, userId, false);
        return ResponseEntity.ok().build();
    }

            @GetMapping("/user/invitations")
    public ResponseEntity<List<TripInvitationDto>> getUserInvitations(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        List<TripInvitationDto> invitations = tripService.getUserInvitations(userId);
        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/test/invitation/{invitationId}")
    public ResponseEntity<String> testFindInvitation(@PathVariable Long invitationId) {
        try {
            var invitation = tripService.findInvitationById(invitationId);
            if (invitation.isPresent()) {
                return ResponseEntity.ok("Found invitation: " + invitation.get().getInvitationId());
            } else {
                return ResponseEntity.ok("Invitation not found");
            }
        } catch (Exception e) {
            return ResponseEntity.ok("Error: " + e.getMessage());
        }
    }

    @PostMapping("/trips/{tripId}/sub-destinations")
    public ResponseEntity<Void> addSubDestinations(
            @PathVariable Long tripId,
            @RequestBody com.porikroma.dto.AddSubDestinationsRequest request,
            HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        tripService.addSubDestinationsToTrip(tripId, request.getSubDestinationIds(), userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trips/{tripId}/accommodations")
    public ResponseEntity<Void> addAccommodations(
            @PathVariable Long tripId,
            @RequestBody List<com.porikroma.dto.AccommodationSelectionDto> accommodationData,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        // Extract accommodation IDs from the request data
        List<Long> accommodationIds = accommodationData.stream()
                .map(com.porikroma.dto.AccommodationSelectionDto::getAccommodationId)
                .collect(java.util.stream.Collectors.toList());
                
        tripService.addAccommodationsToTrip(tripId, accommodationIds, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/trips/{tripId}/transports")
    public ResponseEntity<Void> addTransports(
            @PathVariable Long tripId,
            @RequestBody List<com.porikroma.dto.TransportSelectionDto> transportData,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        
        // Extract transport IDs from the request data
        List<Long> transportIds = transportData.stream()
                .map(com.porikroma.dto.TransportSelectionDto::getTransportId)
                .collect(java.util.stream.Collectors.toList());
                
        tripService.addTransportsToTrip(tripId, transportIds, userId);
        return ResponseEntity.ok().build();
    }
}