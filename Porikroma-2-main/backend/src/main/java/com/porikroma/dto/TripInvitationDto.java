package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripInvitationDto {
    private Long invitationId;
    private Long tripId;
    private String tripName;
    private String tripPhotoUrl;
    private Long inviterUserId;
    private String inviterName;
    private String inviterProfilePicture;
    private Long inviteeUserId;
    private String inviteeName;
    private String invitationMessage;
    private String status;  // PENDING, ACCEPTED, DECLINED, EXPIRED
    private LocalDateTime invitedAt;
    private LocalDateTime respondedAt;
    private LocalDateTime expiresAt;
}