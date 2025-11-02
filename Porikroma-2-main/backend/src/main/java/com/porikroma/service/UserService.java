package com.porikroma.service;

import com.porikroma.dto.UserDto;
import com.porikroma.exception.ResourceNotFoundException;
import com.porikroma.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDto getCurrentUser(Long userId) {
        Optional<UserDto> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }
        UserDto user = userOpt.get();
        user.setPassword(null); // Never return password
        return user;
    }

    public UserDto getUserById(Long id) {
        Optional<UserDto> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }
        UserDto user = userOpt.get();
        user.setPassword(null); // Never return password
        return user;
    }

    public UserDto updateUser(Long userId, UserDto userDto) {
        Optional<UserDto> existingUserOpt = userRepository.findById(userId);
        if (existingUserOpt.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }

        UserDto existingUser = existingUserOpt.get();
        
        // Update only allowed fields
        existingUser.setFirstName(userDto.getFirstName());
        existingUser.setLastName(userDto.getLastName());
        existingUser.setPhoneNumber(userDto.getPhoneNumber());
        existingUser.setDateOfBirth(userDto.getDateOfBirth());
        existingUser.setBio(userDto.getBio());
        existingUser.setLocation(userDto.getLocation());
        existingUser.setEmergencyContactName(userDto.getEmergencyContactName());
        existingUser.setEmergencyContactPhone(userDto.getEmergencyContactPhone());
        existingUser.setTravelPreferences(userDto.getTravelPreferences());
        existingUser.setDietaryRestrictions(userDto.getDietaryRestrictions());

        userRepository.updateUser(existingUser);
        existingUser.setPassword(null); // Never return password
        return existingUser;
    }

    public void updateProfilePicture(Long userId, String imageUrl) {
        Optional<UserDto> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }

        UserDto user = userOpt.get();
        user.setProfilePictureUrl(imageUrl);
        userRepository.updateUser(user);
    }

    public List<UserDto> searchUsers(String query) {
        List<UserDto> users = userRepository.searchUsers(query);
        // Remove passwords from all users
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    public long getTotalUserCount() {
        return userRepository.countActiveUsers();
    }
}