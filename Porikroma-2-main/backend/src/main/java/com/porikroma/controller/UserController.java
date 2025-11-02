package com.porikroma.controller;

import com.porikroma.dto.UserDto;
import com.porikroma.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        UserDto user = userService.getCurrentUser(userId);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserDto userDto, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        UserDto updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(@RequestParam String query, HttpServletRequest request) {
        // Authenticated users can search for other users (for adding to trips)
        List<UserDto> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id, HttpServletRequest request) {
        // Authenticated users can view other user profiles (public information only)
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/me/upload-avatar")
    public ResponseEntity<String> uploadAvatar(@RequestParam String imageUrl, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userService.updateProfilePicture(userId, imageUrl);
        return ResponseEntity.ok("Profile picture updated successfully");
    }
}