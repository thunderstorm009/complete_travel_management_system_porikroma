package com.porikroma.util;

import com.porikroma.dto.DestinationDto;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class DestinationRowMapper implements RowMapper<DestinationDto> {
    @Override
    public DestinationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
        return DestinationDto.builder()
                .destinationId(rs.getLong("destination_id"))
                .destinationName(rs.getString("destination_name"))
                .country(rs.getString("country"))
                .stateProvince(rs.getString("state_province"))
                .city(rs.getString("city"))
                .description(rs.getString("description"))
                .featuredImage(rs.getString("featured_image"))
                .latitude(rs.getBigDecimal("latitude"))
                .longitude(rs.getBigDecimal("longitude"))
                .bestVisitTime(rs.getString("best_visit_time"))
                .weatherInfo(rs.getString("weather_info"))
                .localLanguage(rs.getString("local_language"))
                .currency(rs.getString("currency"))
                .timeZone(rs.getString("time_zone"))
                .entryRequirements(rs.getString("entry_requirements"))
                .safetyRating(rs.getString("safety_rating"))
                .budgetLevel(rs.getString("budget_level"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
    }
}