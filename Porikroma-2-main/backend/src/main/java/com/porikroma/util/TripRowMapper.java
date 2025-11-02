package com.porikroma.util;

import com.porikroma.dto.TripDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TripRowMapper implements RowMapper<TripDto> {
    @Override
    public TripDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        TripDto.TripDtoBuilder builder = TripDto.builder()
                .tripId(rs.getLong("trip_id"))
                .tripName(rs.getString("trip_name"))
                .destinationId(rs.getLong("destination_id"))
                .creatorUserId(rs.getLong("creator_user_id"))
                .tripPhotoUrl(rs.getString("trip_photo_url"))
                .tripBudget(rs.getBigDecimal("trip_budget"))
                .status(rs.getString("status"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);

        // Handle optional dates
        if (rs.getDate("start_date") != null) {
            builder.startDate(rs.getDate("start_date").toLocalDate());
        }
        if (rs.getDate("end_date") != null) {
            builder.endDate(rs.getDate("end_date").toLocalDate());
        }

        // Add joined fields if they exist
        try {
            if (rs.getString("destination_name") != null) {
                builder.destinationName(rs.getString("destination_name"));
            }
        } catch (SQLException ignored) {}

        try {
            if (rs.getString("creator_name") != null) {
                builder.creatorName(rs.getString("creator_name"));
            }
        } catch (SQLException ignored) {}

        return builder.build();
    }
}