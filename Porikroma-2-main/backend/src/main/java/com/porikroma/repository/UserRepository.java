package com.porikroma.repository;

import com.porikroma.dto.UserDto;

import java.util.List;
import java.util.Optional;

public interface UserRepository {
    UserDto save(UserDto user);
    Optional<UserDto> findById(Long id);
    Optional<UserDto> findByEmail(String email);
    Optional<UserDto> findByUsername(String username);
    List<UserDto> findAll();
    List<UserDto> searchUsers(String query);
    void updateUser(UserDto user);
    void updateEmailVerified(Long userId, boolean verified);
    void updatePassword(Long userId, String newPassword);
    void softDelete(Long userId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    long countActiveUsers();
    
    // Additional methods for admin analytics
    long countNewUsersThisMonth();
    double calculateUserGrowthPercentage();
}