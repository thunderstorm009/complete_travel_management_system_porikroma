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
public class NotificationDto {
    private Long notificationId;
    private Long userId;
    private String notificationType;  // TRIP_INVITATION, TRIP_UPDATE, PAYMENT_REMINDER, GENERAL
    private String title;
    private String message;
    private String relatedEntityType;  // TRIP, USER, EXPENSE
    private Long relatedEntityId;
    private boolean isRead;
    private String priority;  // LOW, MEDIUM, HIGH, URGENT
    private String actionUrl;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}