package com.porikroma.repository;

import com.porikroma.dto.DestinationDto;
import com.porikroma.dto.SubDestinationDto;
import com.porikroma.dto.AccommodationDto;
import com.porikroma.dto.TransportDto;
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
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class DestinationRepositoryImpl implements DestinationRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<DestinationDto> destinationRowMapper = new RowMapper<DestinationDto>() {
        @Override
        public DestinationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            return DestinationDto.builder()
                .destinationId(rs.getLong("destination_id"))
                .destinationName(rs.getString("destination_name"))
                .country(rs.getString("country"))
                .city(rs.getString("city"))
                .description(rs.getString("description"))
                .featuredImage(rs.getString("featured_image"))
                .budgetLevel(rs.getString("budget_level"))
                .bestVisitTime(rs.getString("best_visit_time"))
                .currency(rs.getString("currency"))
                .safetyRating(rs.getString("safety_rating"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
        }
    };

    private final RowMapper<SubDestinationDto> subDestinationRowMapper = new RowMapper<SubDestinationDto>() {
        @Override
        public SubDestinationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            return SubDestinationDto.builder()
                .subDestinationId(rs.getLong("sub_destination_id"))
                .destinationId(rs.getLong("destination_id"))
                .subDestinationName(rs.getString("sub_destination_name"))
                .category(rs.getString("category"))
                .description(rs.getString("description"))
                .featuredImage(rs.getString("featured_image"))
                .address(rs.getString("address"))
                .latitude(rs.getBigDecimal("latitude"))
                .longitude(rs.getBigDecimal("longitude"))
                .entryFee(rs.getBigDecimal("entry_fee"))
                .openingHours(rs.getString("opening_hours"))
                .contactPhone(rs.getString("contact_phone"))
                .contactEmail(rs.getString("contact_email"))
                .websiteUrl(rs.getString("website_url"))
                .durationHours(rs.getBigDecimal("duration_hours"))
                .difficultyLevel(rs.getString("difficulty_level"))
                .accessibilityInfo(rs.getString("accessibility_info"))
                .bestVisitTime(rs.getString("best_visit_time"))
                .facilities(rs.getString("facilities"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
        }
    };

    private final RowMapper<AccommodationDto> accommodationRowMapper = new RowMapper<AccommodationDto>() {
        @Override
        public AccommodationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            return AccommodationDto.builder()
                .accommodationId(rs.getLong("accommodation_id"))
                .destinationId(rs.getLong("destination_id"))
                .accommodationName(rs.getString("accommodation_name"))
                .accommodationType(rs.getString("accommodation_type"))
                .description(rs.getString("description"))
                .address(rs.getString("address"))
                .latitude(rs.getBigDecimal("latitude"))
                .longitude(rs.getBigDecimal("longitude"))
                .pricePerNight(rs.getBigDecimal("price_per_night"))
                .currency(rs.getString("currency"))
                .amenities(rs.getString("amenities"))
                .contactPhone(rs.getString("contact_phone"))
                .contactEmail(rs.getString("contact_email"))
                .websiteUrl(rs.getString("website_url"))
                .checkInTime(rs.getTime("check_in_time") != null ? rs.getTime("check_in_time").toLocalTime() : null)
                .checkOutTime(rs.getTime("check_out_time") != null ? rs.getTime("check_out_time").toLocalTime() : null)
                .cancellationPolicy(rs.getString("cancellation_policy"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
        }
    };

    private final RowMapper<TransportDto> transportRowMapper = new RowMapper<TransportDto>() {
        @Override
        public TransportDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            return TransportDto.builder()
                .transportId(rs.getLong("transport_id"))
                .destinationId(rs.getLong("destination_id"))
                .transportType(rs.getString("transport_type"))
                .operatorName(rs.getString("operator_name"))
                .routeFrom(rs.getString("route_from"))
                .routeTo(rs.getString("route_to"))
                .price(rs.getBigDecimal("price"))
                .currency(rs.getString("currency"))
                .durationMinutes(rs.getInt("duration_minutes"))
                .frequency(rs.getString("frequency"))
                .contactPhone(rs.getString("contact_phone"))
                .contactEmail(rs.getString("contact_email"))
                .websiteUrl(rs.getString("website_url"))
                .amenities(rs.getString("amenities"))
                .bookingInfo(rs.getString("booking_info"))
                .seasonalAvailability(rs.getString("seasonal_availability"))
                .createdAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null)
                .updatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null)
                .build();
        }
    };

    @Override
    public List<DestinationDto> findAll() {
        String sql = "SELECT * FROM destinations ORDER BY destination_name";
        return jdbcTemplate.query(sql, destinationRowMapper);
    }

    @Override
    public Optional<DestinationDto> findById(Long destinationId) {
        String sql = "SELECT * FROM destinations WHERE destination_id = ?";
        List<DestinationDto> destinations = jdbcTemplate.query(sql, destinationRowMapper, destinationId);
        return destinations.isEmpty() ? Optional.empty() : Optional.of(destinations.get(0));
    }

    @Override
    public List<DestinationDto> findByCountry(String country) {
        String sql = "SELECT * FROM destinations WHERE country = ? ORDER BY destination_name";
        return jdbcTemplate.query(sql, destinationRowMapper, country);
    }

    @Override
    public List<DestinationDto> findByBudgetLevel(String budgetLevel) {
        String sql = "SELECT * FROM destinations WHERE budget_level = ? ORDER BY destination_name";
        return jdbcTemplate.query(sql, destinationRowMapper, budgetLevel);
    }

    @Override
    public List<DestinationDto> findBySafetyRating(String safetyRating) {
        String sql = "SELECT * FROM destinations WHERE safety_rating = ? ORDER BY destination_name";
        return jdbcTemplate.query(sql, destinationRowMapper, safetyRating);
    }

    @Override
    public List<DestinationDto> searchByName(String name) {
        String sql = "SELECT * FROM destinations WHERE destination_name LIKE ? ORDER BY destination_name";
        return jdbcTemplate.query(sql, destinationRowMapper, "%" + name + "%");
    }

    @Override
    public DestinationDto save(DestinationDto destination) {
        String sql = "INSERT INTO destinations (destination_name, country, city, description, featured_image, budget_level, best_visit_time, currency, safety_rating, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, destination.getDestinationName());
            ps.setString(2, destination.getCountry());
            ps.setString(3, destination.getCity());
            ps.setString(4, destination.getDescription());
            ps.setString(5, destination.getFeaturedImage());
            ps.setString(6, destination.getBudgetLevel());
            ps.setString(7, destination.getBestVisitTime());
            ps.setString(8, destination.getCurrency());
            ps.setString(9, destination.getSafetyRating());
            ps.setTimestamp(10, java.sql.Timestamp.valueOf(destination.getCreatedAt()));
            ps.setTimestamp(11, java.sql.Timestamp.valueOf(destination.getUpdatedAt()));
            return ps;
        }, keyHolder);

        destination.setDestinationId(keyHolder.getKey().longValue());
        return destination;
    }

    @Override
    public DestinationDto update(Long destinationId, DestinationDto destination) {
        String sql = "UPDATE destinations SET destination_name = ?, country = ?, city = ?, description = ?, featured_image = ?, budget_level = ?, best_visit_time = ?, currency = ?, safety_rating = ?, updated_at = ? WHERE destination_id = ?";
        
        jdbcTemplate.update(sql,
            destination.getDestinationName(),
            destination.getCountry(), 
            destination.getCity(),
            destination.getDescription(),
            destination.getFeaturedImage(),
            destination.getBudgetLevel(),
            destination.getBestVisitTime(),
            destination.getCurrency(),
            destination.getSafetyRating(),
            java.sql.Timestamp.valueOf(destination.getUpdatedAt()),
            destinationId);
        
        destination.setDestinationId(destinationId);
        return destination;
    }

    @Override
    public void deleteById(Long destinationId) {
        String sql = "DELETE FROM destinations WHERE destination_id = ?";
        jdbcTemplate.update(sql, destinationId);
    }

    @Override
    public boolean existsById(Long destinationId) {
        String sql = "SELECT COUNT(*) FROM destinations WHERE destination_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, destinationId);
        return count != null && count > 0;
    }

    @Override
    public long count() {
        String sql = "SELECT COUNT(*) FROM destinations";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public long countAll() {
        return count();
    }

    @Override
    public long countAllSubDestinations() {
        String sql = "SELECT COUNT(*) FROM sub_destinations";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public long countAllAccommodations() {
        String sql = "SELECT COUNT(*) FROM accommodations";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public List<DestinationDto> findAllWithFilters(String search, String country, String budgetLevel, int page, int size) {
        StringBuilder sql = new StringBuilder("SELECT * FROM destinations WHERE 1=1");
        List<Object> params = new ArrayList<>();
        
        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (destination_name LIKE ? OR description LIKE ?)");
            String searchPattern = "%" + search + "%";
            params.add(searchPattern);
            params.add(searchPattern);
        }
        
        if (country != null && !country.trim().isEmpty()) {
            sql.append(" AND country = ?");
            params.add(country);
        }
        
        if (budgetLevel != null && !budgetLevel.trim().isEmpty()) {
            sql.append(" AND budget_level = ?");
            params.add(budgetLevel);
        }
        
        sql.append(" ORDER BY destination_name LIMIT ? OFFSET ?");
        params.add(size);
        params.add(page * size);
        
        return jdbcTemplate.query(sql.toString(), destinationRowMapper, params.toArray());
    }

    @Override
    public List<com.porikroma.dto.SubDestinationDto> findSubDestinationsByDestinationId(Long destinationId) {
        String sql = "SELECT * FROM sub_destinations WHERE destination_id = ? ORDER BY sub_destination_name";
        return jdbcTemplate.query(sql, subDestinationRowMapper, destinationId);
    }

    @Override
    public List<com.porikroma.dto.AccommodationDto> findAccommodationsByDestinationId(Long destinationId) {
        String sql = "SELECT * FROM accommodations WHERE destination_id = ? ORDER BY accommodation_name";
        return jdbcTemplate.query(sql, accommodationRowMapper, destinationId);
    }

    @Override
    public List<com.porikroma.dto.TransportDto> findTransportsByDestinationId(Long destinationId) {
        String sql = "SELECT * FROM transport WHERE destination_id = ? ORDER BY transport_type, operator_name";
        return jdbcTemplate.query(sql, transportRowMapper, destinationId);
    }

    @Override
    public List<String> findDistinctCountries() {
        String sql = "SELECT DISTINCT country FROM destinations WHERE country IS NOT NULL ORDER BY country";
        return jdbcTemplate.queryForList(sql, String.class);
    }

    @Override
    public List<String> findDistinctBudgetLevels() {
        String sql = "SELECT DISTINCT budget_level FROM destinations WHERE budget_level IS NOT NULL ORDER BY budget_level";
        return jdbcTemplate.queryForList(sql, String.class);
    }
}