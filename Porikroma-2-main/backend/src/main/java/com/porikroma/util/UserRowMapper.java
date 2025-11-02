package com.porikroma.util;

import com.porikroma.dto.UserDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class UserRowMapper implements RowMapper<UserDto> {
    
    @Override
    public UserDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        return UserDto.builder()
                .userId(rs.getLong("user_id"))
                .username(rs.getString("username"))
                .email(rs.getString("email"))
                .password(rs.getString("password"))
                .firstName(rs.getString("first_name"))
                .lastName(rs.getString("last_name"))
                .phoneNumber(rs.getString("phone_number"))
                .gender(rs.getString("gender"))
                .dateOfBirth(rs.getDate("date_of_birth") != null ? rs.getDate("date_of_birth").toLocalDate() : null)
                .profilePictureUrl(rs.getString("profile_picture_url"))
                .bio(rs.getString("bio"))
                .location(rs.getString("location"))
                .emergencyContactName(rs.getString("emergency_contact_name"))
                .emergencyContactPhone(rs.getString("emergency_contact_phone"))
                .travelPreferences(rs.getString("travel_preferences"))
                .dietaryRestrictions(rs.getString("dietary_restrictions"))
                .emailVerified(rs.getBoolean("email_verified"))
                .phoneVerified(rs.getBoolean("phone_verified"))
                .role(rs.getString("role"))
                .isDeleted(rs.getBoolean("is_deleted"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
    }
}