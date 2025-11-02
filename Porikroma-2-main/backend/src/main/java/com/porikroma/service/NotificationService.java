package com.porikroma.service;

import com.porikroma.dto.NotificationDto;
import com.porikroma.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SocketIOService socketIOService;

    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public int getUnreadCount(Long userId) {
        return (int) notificationRepository.countUnreadForUser(userId);
    }

    public void markAsRead(Long notificationId, Long userId) {
        NotificationDto notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to modify this notification");
        }
        
        notification.setRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.markAsRead(notificationId);
    }

    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    public void deleteNotification(Long notificationId, Long userId) {
        NotificationDto notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this notification");
        }
        
        notificationRepository.deleteById(notificationId);
    }

    public NotificationDto createNotification(NotificationDto notificationDto) {
        notificationDto.setCreatedAt(LocalDateTime.now());
        NotificationDto savedNotification = notificationRepository.save(notificationDto);
        
        // Send real-time notification
        socketIOService.sendNotificationToUser(savedNotification.getUserId(), savedNotification);
        
        return savedNotification;
    }

    public void createTripInvitationNotification(Long inviteeUserId, String tripName, String inviterName, Long invitationId) {
        NotificationDto notification = NotificationDto.builder()
            .userId(inviteeUserId)
            .notificationType("TRIP_INVITATION")
            .title("Trip Invitation")
            .message(inviterName + " invited you to join '" + tripName + "'")
            .relatedEntityType("TRIP")
            .relatedEntityId(invitationId)  // Use invitation ID, not trip ID
            .priority("HIGH")
            .actionUrl("/trips/invitations/" + invitationId + "/respond")
            .isRead(false)
            .build();
        
        createNotification(notification);
    }

    public void createPaymentReminderNotification(Long userId, String description, String amount) {
        NotificationDto notification = NotificationDto.builder()
            .userId(userId)
            .notificationType("PAYMENT_REMINDER")
            .title("Payment Due")
            .message("You owe " + amount + " for " + description)
            .relatedEntityType("EXPENSE")
            .priority("MEDIUM")
            .isRead(false)
            .build();
        
        createNotification(notification);
    }

    public void createTripUpdateNotification(Long userId, String tripName, String updateMessage) {
        NotificationDto notification = NotificationDto.builder()
            .userId(userId)
            .notificationType("TRIP_UPDATE")
            .title("Trip Updated")
            .message(updateMessage + " for '" + tripName + "'")
            .relatedEntityType("TRIP")
            .priority("LOW")
            .isRead(false)
            .build();
        
        createNotification(notification);
    }
}