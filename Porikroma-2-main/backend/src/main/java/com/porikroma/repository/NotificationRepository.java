package com.porikroma.repository;

import com.porikroma.dto.NotificationDto;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository {
    
    List<NotificationDto> findAll();
    
    Optional<NotificationDto> findById(Long notificationId);
    
    List<NotificationDto> findByUserId(Long userId);
    
    List<NotificationDto> findUnreadByUserId(Long userId);
    
    List<NotificationDto> findByType(String type);
    
    NotificationDto save(NotificationDto notification);
    
    void markAsRead(Long notificationId);
    
    void markAllAsReadForUser(Long userId);
    
    void deleteById(Long notificationId);
    
    void deleteAllForUser(Long userId);
    
    boolean existsById(Long notificationId);
    
    long countUnreadForUser(Long userId);
    
    List<NotificationDto> findRecentByUserId(Long userId, int limit);
    
    // Additional methods for service compatibility
    List<NotificationDto> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countUnreadByUserId(Long userId);
    NotificationDto update(NotificationDto notification);
    void markAllAsReadByUserId(Long userId);
}