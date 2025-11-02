package com.porikroma.repository;

import com.porikroma.dto.NotificationDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class NotificationRepositoryImpl implements NotificationRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<NotificationDto> notificationRowMapper = new RowMapper<NotificationDto>() {
        @Override
        public NotificationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            NotificationDto notification = new NotificationDto();
            notification.setNotificationId(rs.getLong("notification_id"));
            notification.setUserId(rs.getLong("user_id"));
            notification.setNotificationType(rs.getString("notification_type"));
            notification.setTitle(rs.getString("title"));
            notification.setMessage(rs.getString("message"));
            notification.setRelatedEntityType(rs.getString("related_entity_type"));
            notification.setRelatedEntityId(rs.getLong("related_entity_id"));
            notification.setRead(rs.getBoolean("is_read"));
            notification.setPriority(rs.getString("priority"));
            notification.setActionUrl(rs.getString("action_url"));
            notification.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            if (rs.getTimestamp("read_at") != null) {
                notification.setReadAt(rs.getTimestamp("read_at").toLocalDateTime());
            }
            return notification;
        }
    };

    @Override
    public List<NotificationDto> findAll() {
        String sql = "SELECT * FROM user_notifications ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper);
    }

    @Override
    public Optional<NotificationDto> findById(Long notificationId) {
        String sql = "SELECT * FROM user_notifications WHERE notification_id = ?";
        List<NotificationDto> notifications = jdbcTemplate.query(sql, notificationRowMapper, notificationId);
        return notifications.isEmpty() ? Optional.empty() : Optional.of(notifications.get(0));
    }

    @Override
    public List<NotificationDto> findByUserId(Long userId) {
        String sql = "SELECT * FROM user_notifications WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, userId);
    }

    @Override
    public List<NotificationDto> findUnreadByUserId(Long userId) {
        String sql = "SELECT * FROM user_notifications WHERE user_id = ? AND is_read = false ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, userId);
    }

    @Override
    public List<NotificationDto> findByType(String type) {
        String sql = "SELECT * FROM user_notifications WHERE notification_type = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, notificationRowMapper, type);
    }

    @Override
    public NotificationDto save(NotificationDto notification) {
        String sql = """
            INSERT INTO user_notifications (user_id, notification_type, title, message, related_entity_type, 
            related_entity_id, is_read, priority, action_url, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, notification.getUserId());
            ps.setString(2, notification.getNotificationType());
            ps.setString(3, notification.getTitle());
            ps.setString(4, notification.getMessage());
            ps.setString(5, notification.getRelatedEntityType());
            ps.setLong(6, notification.getRelatedEntityId() != null ? notification.getRelatedEntityId() : 0);
            ps.setBoolean(7, notification.isRead());
            ps.setString(8, notification.getPriority());
            ps.setString(9, notification.getActionUrl());
            ps.setTimestamp(10, java.sql.Timestamp.valueOf(notification.getCreatedAt()));
            return ps;
        }, keyHolder);

        notification.setNotificationId(keyHolder.getKey().longValue());
        return notification;
    }

    @Override
    public void markAsRead(Long notificationId) {
        String sql = "UPDATE user_notifications SET is_read = true, read_at = ? WHERE notification_id = ?";
        jdbcTemplate.update(sql, java.sql.Timestamp.valueOf(LocalDateTime.now()), notificationId);
    }

    @Override
    public void markAllAsReadForUser(Long userId) {
        String sql = "UPDATE user_notifications SET is_read = true, read_at = ? WHERE user_id = ? AND is_read = false";
        jdbcTemplate.update(sql, java.sql.Timestamp.valueOf(LocalDateTime.now()), userId);
    }

    @Override
    public void deleteById(Long notificationId) {
        String sql = "DELETE FROM user_notifications WHERE notification_id = ?";
        jdbcTemplate.update(sql, notificationId);
    }

    @Override
    public void deleteAllForUser(Long userId) {
        String sql = "DELETE FROM user_notifications WHERE user_id = ?";
        jdbcTemplate.update(sql, userId);
    }

    @Override
    public boolean existsById(Long notificationId) {
        String sql = "SELECT COUNT(*) FROM user_notifications WHERE notification_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, notificationId);
        return count != null && count > 0;
    }

    @Override
    public long countUnreadForUser(Long userId) {
        String sql = "SELECT COUNT(*) FROM user_notifications WHERE user_id = ? AND is_read = false";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, userId);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public List<NotificationDto> findRecentByUserId(Long userId, int limit) {
        String sql = "SELECT * FROM user_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, notificationRowMapper, userId, limit);
    }

    // Additional methods for service compatibility
    @Override
    public List<NotificationDto> findByUserIdOrderByCreatedAtDesc(Long userId) {
        return findByUserId(userId);
    }

    @Override
    public long countUnreadByUserId(Long userId) {
        return countUnreadForUser(userId);
    }

    @Override
    public NotificationDto update(NotificationDto notification) {
        String sql = """
            UPDATE user_notifications SET notification_type = ?, title = ?, message = ?, 
            related_entity_type = ?, related_entity_id = ?, is_read = ?, priority = ?, 
            action_url = ?, read_at = ? WHERE notification_id = ?
            """;
        
        jdbcTemplate.update(sql,
            notification.getNotificationType(),
            notification.getTitle(),
            notification.getMessage(),
            notification.getRelatedEntityType(),
            notification.getRelatedEntityId(),
            notification.isRead(),
            notification.getPriority(),
            notification.getActionUrl(),
            notification.getReadAt() != null ? java.sql.Timestamp.valueOf(notification.getReadAt()) : null,
            notification.getNotificationId());
        
        return notification;
    }

    @Override
    public void markAllAsReadByUserId(Long userId) {
        markAllAsReadForUser(userId);
    }
}