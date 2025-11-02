package com.porikroma.service;

import com.porikroma.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class TokenService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String createEmailVerificationToken(Long userId) {
        return createToken(userId, "EMAIL_VERIFICATION", 24); // 24 hours
    }

    public String createPasswordResetToken(Long userId) {
        return createToken(userId, "PASSWORD_RESET", 1); // 1 hour
    }

    private String createToken(Long userId, String tokenType, int expirationHours) {
        String tokenValue = generateSixDigitPin();
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(expirationHours);

        String sql = """
            INSERT INTO user_tokens (user_id, token_type, token_value, expires_at) 
            VALUES (?, ?, ?, ?)
            """;

        jdbcTemplate.update(sql, userId, tokenType, tokenValue, expiresAt);
        return tokenValue;
    }

    public Long validateEmailVerificationToken(String token) {
        return validateToken(token, "EMAIL_VERIFICATION");
    }

    public Long validatePasswordResetToken(String token) {
        return validateToken(token, "PASSWORD_RESET");
    }

    private Long validateToken(String token, String tokenType) {
        String sql = """
            SELECT user_id FROM user_tokens 
            WHERE token_value = ? AND token_type = ? AND used_at IS NULL AND expires_at > ?
            """;

        try {
            Long userId = jdbcTemplate.queryForObject(sql, Long.class, token, tokenType, LocalDateTime.now());
            
            // Mark token as used
            String updateSql = "UPDATE user_tokens SET used_at = ? WHERE token_value = ?";
            jdbcTemplate.update(updateSql, LocalDateTime.now(), token);
            
            return userId;
        } catch (Exception e) {
            throw new BadRequestException("Invalid or expired token");
        }
    }

    private String generateSixDigitPin() {
        Random random = new Random();
        int pin = 100000 + random.nextInt(900000); // Generate number between 100000 and 999999
        return String.valueOf(pin);
    }
}