package com.porikroma.service;

import com.porikroma.dto.TripDto;
import com.porikroma.dto.TripMemberDto;
import com.porikroma.dto.TripInvitationDto;
import com.porikroma.repository.TripRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class TripService {

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    @Lazy
    private ChatService chatService;

    @Autowired
    @Lazy
    private NotificationService notificationService;

    public List<TripDto> getUserTrips(Long userId) {
        return tripRepository.findByUserId(userId);
    }

    public TripDto getTripById(Long tripId) {
        TripDto trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new RuntimeException("Trip not found"));
        
        // Populate all nested collections
        trip.setMembers(tripRepository.findMembersByTripId(tripId));
        trip.setSubDestinations(tripRepository.findSubDestinationsByTripId(tripId));
        trip.setAccommodations(tripRepository.findAccommodationsByTripId(tripId));
        trip.setTransports(tripRepository.findTransportsByTripId(tripId));
        trip.setExpenses(tripRepository.findExpensesByTripId(tripId));
        
        // Set calculated values
        trip.setMemberCount((int) tripRepository.countMembersByTripId(tripId));
        trip.setTotalExpenses(tripRepository.getTotalExpensesByTripId(tripId));
        
        return trip;
    }

    public TripDto createTrip(TripDto tripDto) {
        tripDto.setCreatedAt(LocalDateTime.now());
        tripDto.setUpdatedAt(LocalDateTime.now());
        
        TripDto savedTrip = tripRepository.save(tripDto);
        
        // Add creator as a member
        TripMemberDto creatorMember = TripMemberDto.builder()
            .tripId(savedTrip.getTripId())
            .userId(savedTrip.getCreatorUserId())
            .memberRole("CREATOR")
            .invitationStatus("ACCEPTED")
            .invitedAt(LocalDateTime.now())
            .respondedAt(LocalDateTime.now())
            .build();
        
        tripRepository.addMember(creatorMember);
        
        // Send welcome message
        chatService.sendSystemMessage(savedTrip.getTripId(), 
            "Welcome to " + savedTrip.getTripName() + "! Start planning your adventure together.");
        
        return savedTrip;
    }

    public TripDto updateTrip(Long tripId, TripDto tripDto, Long userId) {
        // Validate trip exists (throws exception if not found)
        getTripById(tripId);
        
        if (!canEditTrip(tripId, userId)) {
            throw new RuntimeException("Not authorized to update this trip");
        }
        
        tripDto.setTripId(tripId);
        tripDto.setUpdatedAt(LocalDateTime.now());
        
        return tripRepository.update(tripId, tripDto);
    }

    public void deleteTrip(Long tripId, Long userId) {
        TripDto trip = getTripById(tripId);
        
        if (!trip.getCreatorUserId().equals(userId)) {
            throw new RuntimeException("Only trip creator can delete the trip");
        }
        
        tripRepository.deleteById(tripId);
    }

    public List<TripMemberDto> getTripMembers(Long tripId) {
        return tripRepository.findMembersByTripId(tripId);
    }

    public TripInvitationDto inviteUserToTrip(TripInvitationDto invitationDto) {
        if (!canEditTrip(invitationDto.getTripId(), invitationDto.getInviterUserId())) {
            throw new RuntimeException("Not authorized to invite users to this trip");
        }
        
        invitationDto.setInvitedAt(LocalDateTime.now());
        invitationDto.setStatus("PENDING");
        
        TripInvitationDto savedInvitation = tripRepository.saveInvitation(invitationDto);
        
        // Send system message about invitation
        TripDto trip = getTripById(invitationDto.getTripId());
        chatService.sendSystemMessage(invitationDto.getTripId(), 
            invitationDto.getInviterName() + " invited a new member to join " + trip.getTripName());
        
        // Create notification for the invited user
        notificationService.createTripInvitationNotification(
            invitationDto.getInviteeUserId(),
            trip.getTripName(),
            invitationDto.getInviterName(),
            savedInvitation.getInvitationId()
        );
        
        return savedInvitation;
    }

    public List<TripInvitationDto> getUserInvitations(Long userId) {
        return tripRepository.findInvitationsByUserId(userId);
    }

    public void respondToInvitation(Long invitationId, Long userId, boolean accept) {
        TripInvitationDto invitation;
        try {
            System.out.println("DEBUG: respondToInvitation - invitationId: " + invitationId + ", userId: " + userId + ", accept: " + accept);
            invitation = tripRepository.findInvitationById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));
            System.out.println("DEBUG: Found invitation - inviteeUserId: " + invitation.getInviteeUserId());
            
            if (!invitation.getInviteeUserId().equals(userId)) {
                throw new RuntimeException("Not authorized to respond to this invitation");
            }
        } catch (Exception e) {
            System.err.println("ERROR in respondToInvitation: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        
        String status = accept ? "ACCEPTED" : "DECLINED";
        invitation.setStatus(status);
        invitation.setRespondedAt(LocalDateTime.now());
        
        tripRepository.updateInvitation(invitation);
        
        if (accept) {
            // Check if user is already a member before adding
            if (!tripRepository.isUserTripMember(invitation.getTripId(), userId)) {
                // Add user as trip member
                TripMemberDto member = TripMemberDto.builder()
                    .tripId(invitation.getTripId())
                    .userId(userId)
                    .memberRole("MEMBER")
                    .invitationStatus("ACCEPTED")
                    .invitedBy(invitation.getInviterUserId())
                    .invitedAt(invitation.getInvitedAt())
                    .respondedAt(LocalDateTime.now())
                    .build();
                
                tripRepository.addMember(member);
                
                // Send system message
                TripDto trip = getTripById(invitation.getTripId());
                chatService.sendSystemMessage(invitation.getTripId(), 
                    invitation.getInviteeName() + " joined " + trip.getTripName() + "!");
            } else {
                System.out.println("DEBUG: User is already a member of this trip, skipping addMember");
            }
        }
    }

    public boolean hasUserInvitation(Long tripId, Long userId) {
        return tripRepository.hasUserInvitation(tripId, userId);
    }

    public Optional<TripInvitationDto> findInvitationById(Long invitationId) {
        return tripRepository.findInvitationById(invitationId);
    }

    public void addSubDestinationsToTrip(Long tripId, List<Long> subDestinationIds, Long userId) {
        if (!canEditTrip(tripId, userId)) {
            throw new RuntimeException("Not authorized to modify this trip");
        }
        
        tripRepository.addSubDestinations(tripId, subDestinationIds);
    }

    public void addAccommodationsToTrip(Long tripId, List<Long> accommodationIds, Long userId) {
        if (!canEditTrip(tripId, userId)) {
            throw new RuntimeException("Not authorized to modify this trip");
        }
        
        tripRepository.addAccommodations(tripId, accommodationIds);
    }

    public void addTransportsToTrip(Long tripId, List<Long> transportIds, Long userId) {
        if (!canEditTrip(tripId, userId)) {
            throw new RuntimeException("Not authorized to modify this trip");
        }
        
        tripRepository.addTransports(tripId, transportIds);
    }

    public boolean isUserTripMember(Long tripId, Long userId) {
        List<TripMemberDto> members = getTripMembers(tripId);
        return members.stream()
            .anyMatch(member -> member.getUserId().equals(userId) && 
                     "ACCEPTED".equals(member.getInvitationStatus()));
    }

    private boolean canEditTrip(Long tripId, Long userId) {
        List<TripMemberDto> members = getTripMembers(tripId);
        return members.stream()
            .anyMatch(member -> member.getUserId().equals(userId) && 
                     ("CREATOR".equals(member.getMemberRole()) || "ADMIN".equals(member.getMemberRole())));
    }
}