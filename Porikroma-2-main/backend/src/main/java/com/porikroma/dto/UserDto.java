package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long userId;
    private String username;
    private String email;
    private String password;  // Only used for create/update, not returned in responses
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String gender;  // MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY
    private LocalDate dateOfBirth;
    private String profilePictureUrl;
    private String bio;
    private String location;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String travelPreferences;
    private String dietaryRestrictions;
    private boolean emailVerified;
    private boolean phoneVerified;
    private String role;  // TRAVELLER, ADMIN
    private boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}