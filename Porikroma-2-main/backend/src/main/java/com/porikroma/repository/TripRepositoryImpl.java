package com.porikroma.repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.porikroma.dto.TripDto;
import com.porikroma.dto.TripInvitationDto;
import com.porikroma.dto.TripMemberDto;

@Repository
public class TripRepositoryImpl implements TripRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<TripDto> tripRowMapper = new RowMapper<TripDto>() {
        @Override
        public TripDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            TripDto trip = new TripDto();
            trip.setTripId(rs.getLong("trip_id"));
            trip.setTripName(rs.getString("trip_name"));
            trip.setDestinationId(rs.getLong("destination_id"));
            trip.setCreatorUserId(rs.getLong("creator_user_id"));
            trip.setTripPhotoUrl(rs.getString("trip_photo_url"));
            trip.setStartDate(rs.getDate("start_date").toLocalDate());
            trip.setEndDate(rs.getDate("end_date").toLocalDate());
            trip.setTripBudget(rs.getBigDecimal("trip_budget"));
            trip.setStatus(rs.getString("status"));
            trip.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            trip.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            return trip;
        }
    };

    private final RowMapper<TripDto> enhancedTripRowMapper = new RowMapper<TripDto>() {
        @Override
        public TripDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            TripDto trip = new TripDto();
            trip.setTripId(rs.getLong("trip_id"));
            trip.setTripName(rs.getString("trip_name"));
            trip.setDestinationId(rs.getLong("destination_id"));
            trip.setDestinationName(rs.getString("destination_name"));
            trip.setCreatorUserId(rs.getLong("creator_user_id"));
            
            // Combine first and last name for creator name
            String firstName = rs.getString("creator_first_name");
            String lastName = rs.getString("creator_last_name");
            if (firstName != null || lastName != null) {
                trip.setCreatorName((firstName != null ? firstName : "") + 
                                  (lastName != null ? " " + lastName : "").trim());
            }
            
            trip.setTripPhotoUrl(rs.getString("trip_photo_url"));
            trip.setStartDate(rs.getDate("start_date").toLocalDate());
            trip.setEndDate(rs.getDate("end_date").toLocalDate());
            trip.setTripBudget(rs.getBigDecimal("trip_budget"));
            trip.setStatus(rs.getString("status"));
            trip.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            trip.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            return trip;
        }
    };

    private final RowMapper<TripMemberDto> memberRowMapper = new RowMapper<TripMemberDto>() {
        @Override
        public TripMemberDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            TripMemberDto member = new TripMemberDto();
            member.setTripMemberId(rs.getLong("trip_member_id"));
            member.setTripId(rs.getLong("trip_id"));
            member.setUserId(rs.getLong("user_id"));
            member.setMemberRole(rs.getString("member_role"));
            member.setInvitationStatus(rs.getString("invitation_status"));
            member.setInvitedAt(rs.getTimestamp("invited_at").toLocalDateTime());
            if (rs.getTimestamp("responded_at") != null) {
                member.setRespondedAt(rs.getTimestamp("responded_at").toLocalDateTime());
            }
            return member;
        }
    };

    private final RowMapper<TripMemberDto> enhancedMemberRowMapper = new RowMapper<TripMemberDto>() {
        @Override
        public TripMemberDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            TripMemberDto member = new TripMemberDto();
            member.setTripMemberId(rs.getLong("trip_member_id"));
            member.setTripId(rs.getLong("trip_id"));
            member.setUserId(rs.getLong("user_id"));
            
            // Set user details from joined table
            String userFirstName = rs.getString("user_first_name");
            String userLastName = rs.getString("user_last_name");
            if (userFirstName != null || userLastName != null) {
                member.setUserName((userFirstName != null ? userFirstName : "") + 
                                 (userLastName != null ? " " + userLastName : "").trim());
            }
            member.setUserEmail(rs.getString("user_email"));
            member.setUserProfilePicture(rs.getString("user_profile_picture"));
            
            member.setMemberRole(rs.getString("member_role"));
            member.setInvitationStatus(rs.getString("invitation_status"));
            
            // Set inviter details
            Long invitedBy = rs.getLong("invited_by");
            if (!rs.wasNull()) {
                member.setInvitedBy(invitedBy);
                String inviterFirstName = rs.getString("inviter_first_name");
                String inviterLastName = rs.getString("inviter_last_name");
                if (inviterFirstName != null || inviterLastName != null) {
                    member.setInvitedByName((inviterFirstName != null ? inviterFirstName : "") + 
                                          (inviterLastName != null ? " " + inviterLastName : "").trim());
                }
            }
            
            member.setInvitedAt(rs.getTimestamp("invited_at").toLocalDateTime());
            if (rs.getTimestamp("responded_at") != null) {
                member.setRespondedAt(rs.getTimestamp("responded_at").toLocalDateTime());
            }
            
            // Set other fields
            member.setBudgetContribution(rs.getBigDecimal("budget_contribution"));
            member.setEmergencyContact(rs.getString("emergency_contact"));
            member.setDietaryPreferences(rs.getString("dietary_preferences"));
            member.setSpecialRequirements(rs.getString("special_requirements"));
            
            if (rs.getTimestamp("created_at") != null) {
                member.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
            }
            if (rs.getTimestamp("updated_at") != null) {
                member.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
            }
            
            return member;
        }
    };

    // Row mapper for basic invitation queries (without JOIN fields)
    private final RowMapper<TripInvitationDto> basicInvitationRowMapper = new RowMapper<TripInvitationDto>() {
        @Override
        public TripInvitationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            TripInvitationDto invitation = new TripInvitationDto();
            invitation.setInvitationId(rs.getLong("invitation_id"));
            invitation.setTripId(rs.getLong("trip_id"));
            invitation.setInviterUserId(rs.getLong("inviter_user_id"));
            invitation.setInviteeUserId(rs.getLong("invitee_user_id"));
            invitation.setStatus(rs.getString("status"));
            invitation.setInvitedAt(rs.getTimestamp("invited_at").toLocalDateTime());
            
            // Handle nullable fields safely
            Timestamp respondedAt = rs.getTimestamp("responded_at");
            if (respondedAt != null) {
                invitation.setRespondedAt(respondedAt.toLocalDateTime());
            }
            
            String invitationMessage = rs.getString("invitation_message");
            if (invitationMessage != null) {
                invitation.setInvitationMessage(invitationMessage);
            }
            
            Timestamp expiresAt = rs.getTimestamp("expires_at");
            if (expiresAt != null) {
                invitation.setExpiresAt(expiresAt.toLocalDateTime());
            }
            
            return invitation;
        }
    };

    // Row mapper for invitation queries with JOIN fields
    private final RowMapper<TripInvitationDto> invitationRowMapper = new RowMapper<TripInvitationDto>() {
        @Override
        public TripInvitationDto mapRow(ResultSet rs, int rowNum) throws SQLException {
            TripInvitationDto invitation = new TripInvitationDto();
            invitation.setInvitationId(rs.getLong("invitation_id"));
            invitation.setTripId(rs.getLong("trip_id"));
            invitation.setInviterUserId(rs.getLong("inviter_user_id"));
            invitation.setInviteeUserId(rs.getLong("invitee_user_id"));
            invitation.setStatus(rs.getString("status"));
            invitation.setInvitedAt(rs.getTimestamp("invited_at").toLocalDateTime());
            
            // Handle nullable fields safely
            Timestamp respondedAt = rs.getTimestamp("responded_at");
            if (respondedAt != null) {
                invitation.setRespondedAt(respondedAt.toLocalDateTime());
            }
            
            // Map additional fields from JOIN query - handle nulls safely
            String tripName = rs.getString("trip_name");
            if (tripName != null) {
                invitation.setTripName(tripName);
            }
            
            String tripPhotoUrl = rs.getString("trip_photo_url");
            if (tripPhotoUrl != null) {
                invitation.setTripPhotoUrl(tripPhotoUrl);
            }
            
            String inviterName = rs.getString("inviter_name");
            if (inviterName != null) {
                invitation.setInviterName(inviterName);
            }
            
            String inviterProfilePicture = rs.getString("inviter_profile_picture");
            if (inviterProfilePicture != null) {
                invitation.setInviterProfilePicture(inviterProfilePicture);
            }
            
            String invitationMessage = rs.getString("invitation_message");
            if (invitationMessage != null) {
                invitation.setInvitationMessage(invitationMessage);
            }
            
            Timestamp expiresAt = rs.getTimestamp("expires_at");
            if (expiresAt != null) {
                invitation.setExpiresAt(expiresAt.toLocalDateTime());
            }
            
            return invitation;
        }
    };

    @Override
    public List<TripDto> findAll() {
        String sql = "SELECT * FROM trips ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, tripRowMapper);
    }

    @Override
    public Optional<TripDto> findById(Long tripId) {
        String sql = """
            SELECT t.*, 
                   d.destination_name as destination_name,
                   u.first_name as creator_first_name,
                   u.last_name as creator_last_name
            FROM trips t
            LEFT JOIN destinations d ON t.destination_id = d.destination_id
            LEFT JOIN users u ON t.creator_user_id = u.user_id
            WHERE t.trip_id = ?
            """;
        List<TripDto> trips = jdbcTemplate.query(sql, enhancedTripRowMapper, tripId);
        return trips.isEmpty() ? Optional.empty() : Optional.of(trips.get(0));
    }

    @Override
    public List<TripDto> findByUserId(Long userId) {
        String sql = """
            SELECT DISTINCT t.* FROM trips t 
            INNER JOIN trip_members tm ON t.trip_id = tm.trip_id 
            WHERE tm.user_id = ? AND tm.invitation_status = 'ACCEPTED'
            ORDER BY t.created_at DESC
            """;
        return jdbcTemplate.query(sql, tripRowMapper, userId);
    }

    @Override
    public List<TripDto> findByDestinationId(Long destinationId) {
        String sql = "SELECT * FROM trips WHERE destination_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, tripRowMapper, destinationId);
    }

    @Override
    public List<TripDto> findByStatus(String status) {
        String sql = "SELECT * FROM trips WHERE status = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, tripRowMapper, status);
    }

    @Override
    public List<TripDto> findPublicTrips() {
        String sql = "SELECT * FROM trips WHERE is_public = true ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, tripRowMapper);
    }

    @Override
    public List<TripDto> findByDateRange(String startDate, String endDate) {
        String sql = "SELECT * FROM trips WHERE start_date >= ? AND end_date <= ? ORDER BY start_date";
        return jdbcTemplate.query(sql, tripRowMapper, startDate, endDate);
    }

    @Override
    public TripDto save(TripDto trip) {
        String sql = """
            INSERT INTO trips (trip_name, destination_id, creator_user_id, trip_photo_url, start_date, end_date, 
            trip_budget, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, trip.getTripName());
            ps.setLong(2, trip.getDestinationId());
            ps.setLong(3, trip.getCreatorUserId());
            ps.setString(4, trip.getTripPhotoUrl());
            ps.setDate(5, java.sql.Date.valueOf(trip.getStartDate()));
            ps.setDate(6, java.sql.Date.valueOf(trip.getEndDate()));
            ps.setBigDecimal(7, trip.getTripBudget());
            ps.setString(8, trip.getStatus());
            ps.setTimestamp(9, java.sql.Timestamp.valueOf(trip.getCreatedAt()));
            ps.setTimestamp(10, java.sql.Timestamp.valueOf(trip.getUpdatedAt()));
            return ps;
        }, keyHolder);

        trip.setTripId(keyHolder.getKey().longValue());
        return trip;
    }

    @Override
    public TripDto update(Long tripId, TripDto trip) {
        String sql = """
            UPDATE trips SET trip_name = ?, destination_id = ?, trip_photo_url = ?, start_date = ?, end_date = ?, 
            trip_budget = ?, status = ?, updated_at = ? 
            WHERE trip_id = ?
            """;
        
        jdbcTemplate.update(sql,
            trip.getTripName(),
            trip.getDestinationId(),
            trip.getTripPhotoUrl(),
            java.sql.Date.valueOf(trip.getStartDate()),
            java.sql.Date.valueOf(trip.getEndDate()),
            trip.getTripBudget(),
            trip.getStatus(),
            java.sql.Timestamp.valueOf(trip.getUpdatedAt()),
            tripId);
        
        trip.setTripId(tripId);
        return trip;
    }

    @Override
    public void deleteById(Long tripId) {
        String sql = "DELETE FROM trips WHERE trip_id = ?";
        jdbcTemplate.update(sql, tripId);
    }

    @Override
    public boolean existsById(Long tripId) {
        String sql = "SELECT COUNT(*) FROM trips WHERE trip_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tripId);
        return count != null && count > 0;
    }

    @Override
    public long count() {
        String sql = "SELECT COUNT(*) FROM trips";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public long countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM trips WHERE status = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, status);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public List<TripDto> findPopularTrips(int limit) {
        String sql = """
            SELECT t.*, COUNT(tm.user_id) as member_count 
            FROM trips t 
            LEFT JOIN trip_members tm ON t.trip_id = tm.trip_id 
            WHERE t.is_public = true 
            GROUP BY t.trip_id 
            ORDER BY member_count DESC, t.created_at DESC 
            LIMIT ?
            """;
        return jdbcTemplate.query(sql, tripRowMapper, limit);
    }

    @Override
    public List<TripDto> findRecentTrips(int limit) {
        String sql = "SELECT * FROM trips ORDER BY created_at DESC LIMIT ?";
        return jdbcTemplate.query(sql, tripRowMapper, limit);
    }

    // Additional methods for admin analytics
    @Override
    public long countActiveTrips() {
        return countByStatus("ACTIVE");
    }

    @Override
    public long countAllTrips() {
        return count();
    }

    @Override
    public long countCompletedTrips() {
        return countByStatus("COMPLETED");
    }

    @Override
    public double calculateTripGrowthPercentage() {
        String currentMonthSql = "SELECT COUNT(*) FROM trips WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
        String previousMonthSql = "SELECT COUNT(*) FROM trips WHERE created_at >= DATE_SUB(NOW(), INTERVAL 2 MONTH) AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH)";
        
        Integer currentMonth = jdbcTemplate.queryForObject(currentMonthSql, Integer.class);
        Integer previousMonth = jdbcTemplate.queryForObject(previousMonthSql, Integer.class);
        
        if (previousMonth == null || previousMonth == 0) {
            return currentMonth != null && currentMonth > 0 ? 100.0 : 0.0;
        }
        
        return ((double) (currentMonth - previousMonth) / previousMonth) * 100.0;
    }

    // Trip member management
    @Override
    public void addMember(TripMemberDto member) {
        String sql = """
            INSERT INTO trip_members (trip_id, user_id, member_role, invitation_status, invited_at) 
            VALUES (?, ?, ?, ?, ?)
            """;
        jdbcTemplate.update(sql, 
            member.getTripId(),
            member.getUserId(),
            member.getMemberRole(),
            member.getInvitationStatus(),
            java.sql.Timestamp.valueOf(member.getInvitedAt())
        );
    }

    @Override
    public List<TripMemberDto> findMembersByTripId(Long tripId) {
        String sql = """
            SELECT tm.*, 
                   u.first_name as user_first_name,
                   u.last_name as user_last_name,
                   u.email as user_email,
                   u.profile_picture_url as user_profile_picture,
                   inv.first_name as inviter_first_name,
                   inv.last_name as inviter_last_name
            FROM trip_members tm
            LEFT JOIN users u ON tm.user_id = u.user_id
            LEFT JOIN users inv ON tm.invited_by = inv.user_id
            WHERE tm.trip_id = ? 
            ORDER BY tm.invited_at
            """;
        
        return jdbcTemplate.query(sql, enhancedMemberRowMapper, tripId);
    }

    @Override
    public boolean isUserTripMember(Long tripId, Long userId) {
        String sql = "SELECT COUNT(*) FROM trip_members WHERE trip_id = ? AND user_id = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tripId, userId);
        return count != null && count > 0;
    }

    // Trip invitation management
    @Override
    public TripInvitationDto saveInvitation(TripInvitationDto invitation) {
        String sql = """
            INSERT INTO trip_invitations (trip_id, inviter_user_id, invitee_user_id, status, invited_at) 
            VALUES (?, ?, ?, ?, ?)
            """;
        
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setLong(1, invitation.getTripId());
            ps.setLong(2, invitation.getInviterUserId());
            ps.setLong(3, invitation.getInviteeUserId());
            ps.setString(4, invitation.getStatus());
            ps.setTimestamp(5, java.sql.Timestamp.valueOf(invitation.getInvitedAt()));
            return ps;
        }, keyHolder);

        invitation.setInvitationId(keyHolder.getKey().longValue());
        return invitation;
    }

    @Override
    public Optional<TripInvitationDto> findInvitationById(Long invitationId) {
        String sql = "SELECT * FROM trip_invitations WHERE invitation_id = ?";
        List<TripInvitationDto> invitations = jdbcTemplate.query(sql, basicInvitationRowMapper, invitationId);
        return invitations.isEmpty() ? Optional.empty() : Optional.of(invitations.get(0));
    }

    @Override
    public void updateInvitation(TripInvitationDto invitation) {
        String sql = "UPDATE trip_invitations SET status = ?, responded_at = ? WHERE invitation_id = ?";
        jdbcTemplate.update(sql, 
            invitation.getStatus(), 
            invitation.getRespondedAt() != null ? java.sql.Timestamp.valueOf(invitation.getRespondedAt()) : null,
            invitation.getInvitationId()
        );
    }

    @Override
    public List<TripInvitationDto> findInvitationsByUserId(Long userId) {
        String sql = """
            SELECT ti.*, t.trip_name, t.trip_photo_url,
                   u1.first_name as inviter_name, u1.profile_picture_url as inviter_profile_picture
            FROM trip_invitations ti
            JOIN trips t ON ti.trip_id = t.trip_id
            JOIN users u1 ON ti.inviter_user_id = u1.user_id
            WHERE ti.invitee_user_id = ? AND ti.status = 'PENDING'
            ORDER BY ti.invited_at DESC
            """;
        return jdbcTemplate.query(sql, invitationRowMapper, userId);
    }

    @Override
    public boolean hasUserInvitation(Long tripId, Long userId) {
        String sql = "SELECT COUNT(*) FROM trip_invitations WHERE trip_id = ? AND invitee_user_id = ? AND status = 'PENDING'";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tripId, userId);
        return count != null && count > 0;
    }

    // Trip features - Real implementations
    @Override
    public void addSubDestinations(Long tripId, List<Long> subDestinationIds) {
        String sql = "INSERT IGNORE INTO trip_subdestinations (trip_id, sub_destination_id, status, created_at) VALUES (?, ?, 'PLANNED', NOW())";
        for (Long subDestinationId : subDestinationIds) {
            jdbcTemplate.update(sql, tripId, subDestinationId);
        }
    }

    @Override
    public void addAccommodations(Long tripId, List<Long> accommodationIds) {
        String sql = "INSERT IGNORE INTO trip_accommodations (trip_id, accommodation_id, booking_status, created_at, updated_at) VALUES (?, ?, 'PLANNED', NOW(), NOW())";
        for (Long accommodationId : accommodationIds) {
            jdbcTemplate.update(sql, tripId, accommodationId);
        }
    }

    @Override
    public void addTransports(Long tripId, List<Long> transportIds) {
        String sql = "INSERT IGNORE INTO trip_transport (trip_id, transport_id, booking_status, created_at, updated_at) VALUES (?, ?, 'PLANNED', NOW(), NOW())";
        for (Long transportId : transportIds) {
            jdbcTemplate.update(sql, tripId, transportId);
        }
    }

    // Trip data retrieval implementations
    @Override
    public List<com.porikroma.dto.SubDestinationDto> findSubDestinationsByTripId(Long tripId) {
        String sql = """
            SELECT sd.*, ts.estimated_cost, ts.status, ts.notes, d.destination_name
            FROM trip_subdestinations ts
            JOIN sub_destinations sd ON ts.sub_destination_id = sd.sub_destination_id
            JOIN destinations d ON sd.destination_id = d.destination_id
            WHERE ts.trip_id = ?
            ORDER BY sd.sub_destination_name
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            com.porikroma.dto.SubDestinationDto dto = new com.porikroma.dto.SubDestinationDto();
            dto.setSubDestinationId(rs.getLong("sub_destination_id"));
            dto.setDestinationId(rs.getLong("destination_id"));
            dto.setDestinationName(rs.getString("destination_name"));
            dto.setSubDestinationName(rs.getString("sub_destination_name"));
            dto.setCategory(rs.getString("category"));
            dto.setDescription(rs.getString("description"));
            dto.setFeaturedImage(rs.getString("featured_image"));
            dto.setAddress(rs.getString("address"));
            dto.setLatitude(rs.getBigDecimal("latitude"));
            dto.setLongitude(rs.getBigDecimal("longitude"));
            dto.setEntryFee(rs.getBigDecimal("entry_fee"));
            dto.setOpeningHours(rs.getString("opening_hours"));
            dto.setContactPhone(rs.getString("contact_phone"));
            dto.setContactEmail(rs.getString("contact_email"));
            dto.setWebsiteUrl(rs.getString("website_url"));
            dto.setDurationHours(rs.getBigDecimal("duration_hours"));
            dto.setDifficultyLevel(rs.getString("difficulty_level"));
            dto.setAccessibilityInfo(rs.getString("accessibility_info"));
            dto.setBestVisitTime(rs.getString("best_visit_time"));
            dto.setFacilities(rs.getString("facilities"));
            dto.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            
            // Trip-specific fields from trip_subdestinations table
            dto.setEstimatedCost(rs.getBigDecimal("estimated_cost"));
            dto.setStatus(rs.getString("status"));
            dto.setNotes(rs.getString("notes"));
            
            return dto;
        }, tripId);
    }

    @Override
    public List<com.porikroma.dto.AccommodationDto> findAccommodationsByTripId(Long tripId) {
        String sql = """
            SELECT a.*, ta.check_in_date, ta.check_out_date, ta.number_of_rooms, 
                   ta.room_type, ta.total_cost, ta.booking_status, ta.booking_reference, 
                   ta.special_requests, d.destination_name
            FROM trip_accommodations ta
            JOIN accommodations a ON ta.accommodation_id = a.accommodation_id
            JOIN destinations d ON a.destination_id = d.destination_id
            WHERE ta.trip_id = ?
            ORDER BY a.accommodation_name
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            com.porikroma.dto.AccommodationDto dto = new com.porikroma.dto.AccommodationDto();
            dto.setAccommodationId(rs.getLong("accommodation_id"));
            dto.setDestinationId(rs.getLong("destination_id"));
            dto.setDestinationName(rs.getString("destination_name"));
            dto.setAccommodationName(rs.getString("accommodation_name"));
            dto.setAccommodationType(rs.getString("accommodation_type"));
            dto.setDescription(rs.getString("description"));
            dto.setAddress(rs.getString("address"));
            dto.setLatitude(rs.getBigDecimal("latitude"));
            dto.setLongitude(rs.getBigDecimal("longitude"));
            dto.setContactPhone(rs.getString("contact_phone"));
            dto.setContactEmail(rs.getString("contact_email"));
            dto.setWebsiteUrl(rs.getString("website_url"));
            dto.setCheckInTime(rs.getTime("check_in_time") != null ? rs.getTime("check_in_time").toLocalTime() : null);
            dto.setCheckOutTime(rs.getTime("check_out_time") != null ? rs.getTime("check_out_time").toLocalTime() : null);
            dto.setPricePerNight(rs.getBigDecimal("price_per_night"));
            dto.setCurrency(rs.getString("currency"));
            dto.setAmenities(rs.getString("amenities"));
            dto.setRoomTypes(rs.getString("room_types"));
            dto.setCancellationPolicy(rs.getString("cancellation_policy"));
            // Parse photos JSON array if exists
            String photosJson = rs.getString("photos");
            if (photosJson != null && !photosJson.isEmpty()) {
                // Simple JSON array parsing - can be improved with Jackson if needed
                dto.setPhotos(java.util.Arrays.asList(photosJson.replaceAll("[\\[\\]\"]", "").split(",")));
            }
            dto.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            
            // Trip-specific fields
            dto.setCheckInDate(rs.getDate("check_in_date") != null ? rs.getDate("check_in_date").toLocalDate() : null);
            dto.setCheckOutDate(rs.getDate("check_out_date") != null ? rs.getDate("check_out_date").toLocalDate() : null);
            dto.setNumberOfRooms(rs.getInt("number_of_rooms"));
            dto.setRoomType(rs.getString("room_type"));
            
            // Calculate total cost if not set
            java.math.BigDecimal totalCost = rs.getBigDecimal("total_cost");
            if (totalCost == null && dto.getPricePerNight() != null) {
                int rooms = dto.getNumberOfRooms() > 0 ? dto.getNumberOfRooms() : 1;
                // Estimate 7 days if no dates set, otherwise calculate days
                int nights = 7;
                if (dto.getCheckInDate() != null && dto.getCheckOutDate() != null) {
                    nights = (int) java.time.temporal.ChronoUnit.DAYS.between(dto.getCheckInDate(), dto.getCheckOutDate());
                }
                totalCost = dto.getPricePerNight().multiply(java.math.BigDecimal.valueOf(rooms * nights));
            }
            dto.setTotalCost(totalCost);
            
            dto.setBookingStatus(rs.getString("booking_status"));
            dto.setBookingReference(rs.getString("booking_reference"));
            dto.setSpecialRequests(rs.getString("special_requests"));
            
            return dto;
        }, tripId);
    }

    @Override
    public List<com.porikroma.dto.TransportDto> findTransportsByTripId(Long tripId) {
        String sql = """
            SELECT t.*, tt.journey_type, tt.travel_date, tt.departure_time as trip_departure_time, 
                   tt.arrival_time as trip_arrival_time, tt.number_of_passengers, tt.seat_preference, 
                   tt.total_cost, tt.booking_status, tt.booking_reference, d.destination_name
            FROM trip_transport tt
            JOIN transport t ON tt.transport_id = t.transport_id
            JOIN destinations d ON t.destination_id = d.destination_id
            WHERE tt.trip_id = ?
            ORDER BY t.transport_type, t.operator_name
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            com.porikroma.dto.TransportDto dto = new com.porikroma.dto.TransportDto();
            dto.setTransportId(rs.getLong("transport_id"));
            dto.setDestinationId(rs.getLong("destination_id"));
            dto.setDestinationName(rs.getString("destination_name"));
            dto.setTransportType(rs.getString("transport_type"));
            dto.setOperatorName(rs.getString("operator_name"));
            dto.setRouteFrom(rs.getString("route_from"));
            dto.setRouteTo(rs.getString("route_to"));
            dto.setDepartureTime(rs.getTime("departure_time") != null ? rs.getTime("departure_time").toLocalTime() : null);
            dto.setArrivalTime(rs.getTime("arrival_time") != null ? rs.getTime("arrival_time").toLocalTime() : null);
            dto.setDurationMinutes(rs.getInt("duration_minutes"));
            dto.setPrice(rs.getBigDecimal("price"));
            dto.setCurrency(rs.getString("currency"));
            dto.setSeatTypes(rs.getString("seat_types"));
            dto.setAmenities(rs.getString("amenities"));
            dto.setBookingInfo(rs.getString("booking_info"));
            dto.setContactPhone(rs.getString("contact_phone"));
            dto.setContactEmail(rs.getString("contact_email"));
            dto.setWebsiteUrl(rs.getString("website_url"));
            dto.setFrequency(rs.getString("frequency"));
            dto.setSeasonalAvailability(rs.getString("seasonal_availability"));
            dto.setCreatedAt(rs.getTimestamp("created_at") != null ? rs.getTimestamp("created_at").toLocalDateTime() : null);
            dto.setUpdatedAt(rs.getTimestamp("updated_at") != null ? rs.getTimestamp("updated_at").toLocalDateTime() : null);
            
            // Trip-specific fields
            dto.setJourneyType(rs.getString("journey_type"));
            dto.setTravelDate(rs.getDate("travel_date") != null ? rs.getDate("travel_date").toLocalDate() : null);
            dto.setTripDepartureTime(rs.getTime("trip_departure_time") != null ? rs.getTime("trip_departure_time").toLocalTime() : null);
            dto.setTripArrivalTime(rs.getTime("trip_arrival_time") != null ? rs.getTime("trip_arrival_time").toLocalTime() : null);
            dto.setNumberOfPassengers(rs.getInt("number_of_passengers"));
            dto.setSeatPreference(rs.getString("seat_preference"));
            
            // Calculate total cost if not set
            java.math.BigDecimal totalCost = rs.getBigDecimal("total_cost");
            if (totalCost == null && dto.getPrice() != null) {
                int passengers = dto.getNumberOfPassengers() > 0 ? dto.getNumberOfPassengers() : 1;
                totalCost = dto.getPrice().multiply(java.math.BigDecimal.valueOf(passengers));
            }
            dto.setTotalCost(totalCost);
            
            dto.setBookingStatus(rs.getString("booking_status"));
            dto.setBookingReference(rs.getString("booking_reference"));
            
            return dto;
        }, tripId);
    }

    @Override
    public List<com.porikroma.dto.ExpenseDto> findExpensesByTripId(Long tripId) {
        String sql = """
            SELECT * FROM trip_expenses 
            WHERE trip_id = ?
            ORDER BY expense_date DESC, created_at DESC
            """;
        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            com.porikroma.dto.ExpenseDto dto = new com.porikroma.dto.ExpenseDto();
            dto.setExpenseId(rs.getLong("expense_id"));
            dto.setTripId(rs.getLong("trip_id"));
            dto.setPaidByUserId(rs.getLong("paid_by_user_id"));
            dto.setExpenseCategory(rs.getString("expense_category"));
            dto.setDescription(rs.getString("description"));
            dto.setAmount(rs.getBigDecimal("amount"));
            dto.setCurrency(rs.getString("currency"));
            dto.setExpenseDate(rs.getDate("expense_date").toLocalDate());
            return dto;
        }, tripId);
    }

    @Override
    public long countMembersByTripId(Long tripId) {
        String sql = "SELECT COUNT(*) FROM trip_members WHERE trip_id = ?";
        return jdbcTemplate.queryForObject(sql, Long.class, tripId);
    }

    @Override
    public java.math.BigDecimal getTotalExpensesByTripId(Long tripId) {
        // Calculate total from actual expenses + accommodation costs + transport costs + sub-destination costs
        String sql = """
            SELECT 
                COALESCE(SUM(te.amount), 0) +
                COALESCE((SELECT SUM(CASE 
                    WHEN ta.total_cost IS NOT NULL THEN ta.total_cost
                    ELSE a.price_per_night * GREATEST(ta.number_of_rooms, 1) * 7
                END) FROM trip_accommodations ta 
                JOIN accommodations a ON ta.accommodation_id = a.accommodation_id 
                WHERE ta.trip_id = ?), 0) +
                COALESCE((SELECT SUM(CASE 
                    WHEN tt.total_cost IS NOT NULL THEN tt.total_cost
                    ELSE t.price * GREATEST(tt.number_of_passengers, 1)
                END) FROM trip_transport tt 
                JOIN transport t ON tt.transport_id = t.transport_id 
                WHERE tt.trip_id = ?), 0) +
                COALESCE((SELECT SUM(COALESCE(ts.estimated_cost, sd.entry_fee, 0)) 
                FROM trip_subdestinations ts 
                JOIN sub_destinations sd ON ts.sub_destination_id = sd.sub_destination_id 
                WHERE ts.trip_id = ?), 0) as total_cost
            FROM trip_expenses te 
            WHERE te.trip_id = ?
            """;
        java.math.BigDecimal result = jdbcTemplate.queryForObject(sql, java.math.BigDecimal.class, tripId, tripId, tripId, tripId);
        return result != null ? result : java.math.BigDecimal.ZERO;
    }
}