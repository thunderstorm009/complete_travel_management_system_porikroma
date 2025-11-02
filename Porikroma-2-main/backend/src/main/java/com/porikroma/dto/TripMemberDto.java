package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripMemberDto {
    private Long tripMemberId;
    private Long tripId;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userProfilePicture;
    private String memberRole;  // CREATOR, ADMIN, MEMBER
    private String invitationStatus;  // PENDING, ACCEPTED, DECLINED, REMOVED
    private Long invitedBy;
    private String invitedByName;
    private LocalDateTime invitedAt;
    private LocalDateTime respondedAt;
    private BigDecimal budgetContribution;
    private String emergencyContact;
    private String dietaryPreferences;
    private String specialRequirements;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}