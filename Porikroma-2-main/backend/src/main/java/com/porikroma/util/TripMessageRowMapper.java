package com.porikroma.util;

import com.porikroma.dto.TripMessageDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

public class TripMessageRowMapper implements RowMapper<TripMessageDto> {
    @Override
    public TripMessageDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        TripMessageDto.TripMessageDtoBuilder builder = TripMessageDto.builder()
                .messageId(rs.getLong("message_id"))
                .tripId(rs.getLong("trip_id"))
                .senderUserId(rs.getObject("sender_user_id", Long.class))
                .messageType(rs.getString("message_type"))
                .content(rs.getString("content"))
                .attachmentUrl(rs.getString("attachment_url"))
                .replyToMessageId(rs.getObject("reply_to_message_id", Long.class))
                .isEdited(rs.getBoolean("is_edited"))
                .createdAt(rs.getTimestamp("created_at") != null ? 
                          rs.getTimestamp("created_at").toLocalDateTime() : null)
                .editedAt(rs.getTimestamp("edited_at") != null ? 
                         rs.getTimestamp("edited_at").toLocalDateTime() : null);

        // Handle sender info
        String firstName = rs.getString("first_name");
        String lastName = rs.getString("last_name");
        if (firstName != null && lastName != null) {
            builder.senderName(firstName + " " + lastName);
        }
        builder.senderProfilePicture(rs.getString("profile_picture_url"));

        // Handle reply info
        builder.replyToContent(rs.getString("reply_content"));
        builder.replyToSenderName(rs.getString("reply_sender_name"));

        // Handle poll options
        String pollOptionsString = rs.getString("poll_options");
        if (pollOptionsString != null && !pollOptionsString.isEmpty()) {
            List<String> pollOptions = Arrays.asList(pollOptionsString.split(","));
            builder.pollOptions(pollOptions);
        }

        return builder.build();
    }
}