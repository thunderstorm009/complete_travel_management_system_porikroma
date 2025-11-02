package com.porikroma.repository;

import com.porikroma.dto.TripMessageDto;
import com.porikroma.util.TripMessageRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class ChatRepositoryImpl implements ChatRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final TripMessageRowMapper messageRowMapper = new TripMessageRowMapper();

    @Override
    public List<TripMessageDto> findByTripIdOrderByCreatedAt(Long tripId) {
        String sql = """
            SELECT m.*, u.first_name, u.last_name, u.profile_picture_url,
                   rm.content as reply_content, ru.first_name as reply_sender_name
            FROM trip_messages m
            LEFT JOIN users u ON m.sender_user_id = u.user_id
            LEFT JOIN trip_messages rm ON m.reply_to_message_id = rm.message_id
            LEFT JOIN users ru ON rm.sender_user_id = ru.user_id
            WHERE m.trip_id = ?
            ORDER BY m.created_at ASC
            """;
        return jdbcTemplate.query(sql, messageRowMapper, tripId);
    }

    @Override
    public TripMessageDto save(TripMessageDto messageDto) {
        String sql = """
            INSERT INTO trip_messages (trip_id, sender_user_id, message_type, content, 
                                     attachment_url, poll_options, reply_to_message_id, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime now = LocalDateTime.now();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, messageDto.getTripId());
            ps.setObject(2, messageDto.getSenderUserId());
            ps.setString(3, messageDto.getMessageType());
            ps.setString(4, messageDto.getContent());
            ps.setString(5, messageDto.getAttachmentUrl());
            ps.setString(6, messageDto.getPollOptions() != null ? 
                String.join(",", messageDto.getPollOptions()) : null);
            ps.setObject(7, messageDto.getReplyToMessageId());
            ps.setTimestamp(8, Timestamp.valueOf(now));
            return ps;
        }, keyHolder);

        Long generatedId = keyHolder.getKey().longValue();
        messageDto.setMessageId(generatedId);
        messageDto.setCreatedAt(now);
        
        // Get sender info
        if (messageDto.getSenderUserId() != null) {
            String userSql = "SELECT first_name, last_name, profile_picture_url FROM users WHERE user_id = ?";
            jdbcTemplate.query(userSql, rs -> {
                messageDto.setSenderName(rs.getString("first_name") + " " + rs.getString("last_name"));
                messageDto.setSenderProfilePicture(rs.getString("profile_picture_url"));
            }, messageDto.getSenderUserId());
        }
        
        return messageDto;
    }

    @Override
    public Optional<TripMessageDto> findById(Long messageId) {
        String sql = """
            SELECT m.*, u.first_name, u.last_name, u.profile_picture_url,
                   rm.content as reply_content, ru.first_name as reply_sender_name
            FROM trip_messages m
            LEFT JOIN users u ON m.sender_user_id = u.user_id
            LEFT JOIN trip_messages rm ON m.reply_to_message_id = rm.message_id
            LEFT JOIN users ru ON rm.sender_user_id = ru.user_id
            WHERE m.message_id = ?
            """;
        List<TripMessageDto> messages = jdbcTemplate.query(sql, messageRowMapper, messageId);
        return messages.isEmpty() ? Optional.empty() : Optional.of(messages.get(0));
    }

    @Override
    public TripMessageDto update(TripMessageDto messageDto) {
        String sql = """
            UPDATE trip_messages 
            SET content = ?, is_edited = ?, edited_at = ? 
            WHERE message_id = ?
            """;
        jdbcTemplate.update(sql, 
            messageDto.getContent(),
            messageDto.isEdited(),
            messageDto.getEditedAt(),
            messageDto.getMessageId());
        return messageDto;
    }

    @Override
    public void deleteById(Long messageId) {
        String sql = "DELETE FROM trip_messages WHERE message_id = ?";
        jdbcTemplate.update(sql, messageId);
    }

    @Override
    public TripMessageDto updatePollVote(Long messageId, Long userId, String option) {
        // For now, just return the message as-is
        // In a real implementation, you'd update poll votes in a separate table or JSON column
        return findById(messageId).orElse(null);
    }

    @Override
    public List<TripMessageDto> findRecentMessages(Long tripId, int limit) {
        String sql = """
            SELECT m.*, u.first_name, u.last_name, u.profile_picture_url,
                   rm.content as reply_content, ru.first_name as reply_sender_name
            FROM trip_messages m
            LEFT JOIN users u ON m.sender_user_id = u.user_id
            LEFT JOIN trip_messages rm ON m.reply_to_message_id = rm.message_id
            LEFT JOIN users ru ON rm.sender_user_id = ru.user_id
            WHERE m.trip_id = ?
            ORDER BY m.created_at DESC
            LIMIT ?
            """;
        return jdbcTemplate.query(sql, messageRowMapper, tripId, limit);
    }

    @Override
    public Long getTripCreatorId(Long tripId) {
        String sql = "SELECT created_by FROM trips WHERE trip_id = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, tripId);
    }
}