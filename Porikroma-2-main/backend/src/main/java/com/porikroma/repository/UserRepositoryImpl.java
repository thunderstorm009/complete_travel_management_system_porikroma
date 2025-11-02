package com.porikroma.repository;

import com.porikroma.dto.UserDto;
import com.porikroma.util.UserRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final UserRowMapper userRowMapper = new UserRowMapper();

    @Override
    public UserDto save(UserDto user) {
        String sql = """
            INSERT INTO users (username, email, password, first_name, last_name, phone_number, gender, 
                              date_of_birth, emergency_contact_name, emergency_contact_phone, 
                              travel_preferences, dietary_restrictions, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();
        LocalDateTime now = LocalDateTime.now();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getUsername());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getFirstName());
            ps.setString(5, user.getLastName());
            ps.setString(6, user.getPhoneNumber());
            ps.setString(7, user.getGender());
            ps.setDate(8, user.getDateOfBirth() != null ? java.sql.Date.valueOf(user.getDateOfBirth()) : null);
            ps.setString(9, user.getEmergencyContactName());
            ps.setString(10, user.getEmergencyContactPhone());
            ps.setString(11, user.getTravelPreferences());
            ps.setString(12, user.getDietaryRestrictions());
            ps.setObject(13, now);
            ps.setObject(14, now);
            return ps;
        }, keyHolder);

        Long generatedId = keyHolder.getKey().longValue();
        user.setUserId(generatedId);
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        return user;
    }

    @Override
    public Optional<UserDto> findById(Long id) {
        String sql = "SELECT * FROM users WHERE user_id = ? AND is_deleted = FALSE";
        try {
            UserDto user = jdbcTemplate.queryForObject(sql, userRowMapper, id);
            return Optional.of(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserDto> findByEmail(String email) {
        String sql = "SELECT * FROM users WHERE email = ? AND is_deleted = FALSE";
        try {
            UserDto user = jdbcTemplate.queryForObject(sql, userRowMapper, email);
            return Optional.of(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserDto> findByUsername(String username) {
        String sql = "SELECT * FROM users WHERE username = ? AND is_deleted = FALSE";
        try {
            UserDto user = jdbcTemplate.queryForObject(sql, userRowMapper, username);
            return Optional.of(user);
        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    @Override
    public List<UserDto> findAll() {
        String sql = "SELECT * FROM users WHERE is_deleted = FALSE ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, userRowMapper);
    }

    @Override
    public List<UserDto> searchUsers(String query) {
        String sql = """
            SELECT * FROM users 
            WHERE is_deleted = FALSE 
            AND (username LIKE ? OR email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)
            ORDER BY username
            """;
        String searchPattern = "%" + query + "%";
        return jdbcTemplate.query(sql, userRowMapper, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    @Override
    public void updateUser(UserDto user) {
        String sql = """
            UPDATE users SET 
            first_name = ?, last_name = ?, phone_number = ?, date_of_birth = ?, 
            profile_picture_url = ?, bio = ?, location = ?, emergency_contact_name = ?, 
            emergency_contact_phone = ?, travel_preferences = ?, dietary_restrictions = ?, 
            updated_at = ? 
            WHERE user_id = ?
            """;
        
        jdbcTemplate.update(sql,
                user.getFirstName(), user.getLastName(), user.getPhoneNumber(),
                user.getDateOfBirth() != null ? java.sql.Date.valueOf(user.getDateOfBirth()) : null,
                user.getProfilePictureUrl(), user.getBio(), user.getLocation(),
                user.getEmergencyContactName(), user.getEmergencyContactPhone(),
                user.getTravelPreferences(), user.getDietaryRestrictions(),
                LocalDateTime.now(), user.getUserId());
    }

    @Override
    public void updateEmailVerified(Long userId, boolean verified) {
        String sql = "UPDATE users SET email_verified = ?, updated_at = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, verified, LocalDateTime.now(), userId);
    }

    @Override
    public void updatePassword(Long userId, String newPassword) {
        String sql = "UPDATE users SET password = ?, updated_at = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, newPassword, LocalDateTime.now(), userId);
    }

    @Override
    public void softDelete(Long userId) {
        String sql = "UPDATE users SET is_deleted = TRUE, updated_at = ? WHERE user_id = ?";
        jdbcTemplate.update(sql, LocalDateTime.now(), userId);
    }

    @Override
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ? AND is_deleted = FALSE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, email);
        return count != null && count > 0;
    }

    @Override
    public boolean existsByUsername(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ? AND is_deleted = FALSE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, username);
        return count != null && count > 0;
    }

    @Override
    public long countActiveUsers() {
        String sql = "SELECT COUNT(*) FROM users WHERE is_deleted = FALSE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public long countNewUsersThisMonth() {
        String sql = "SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND is_deleted = FALSE";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0L;
    }

    @Override
    public double calculateUserGrowthPercentage() {
        String currentMonthSql = "SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH) AND is_deleted = FALSE";
        String previousMonthSql = "SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 2 MONTH) AND created_at < DATE_SUB(NOW(), INTERVAL 1 MONTH) AND is_deleted = FALSE";
        
        Integer currentMonth = jdbcTemplate.queryForObject(currentMonthSql, Integer.class);
        Integer previousMonth = jdbcTemplate.queryForObject(previousMonthSql, Integer.class);
        
        if (previousMonth == null || previousMonth == 0) {
            return currentMonth != null && currentMonth > 0 ? 100.0 : 0.0;
        }
        
        return ((double) (currentMonth - previousMonth) / previousMonth) * 100.0;
    }
}