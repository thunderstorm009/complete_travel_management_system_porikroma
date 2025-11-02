package com.porikroma.service;

import com.porikroma.dto.*;
import com.porikroma.exception.BadRequestException;
import com.porikroma.exception.ResourceNotFoundException;
import com.porikroma.repository.UserRepository;
import com.porikroma.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private TokenService tokenService;

    public AuthResponseDto register(RegisterRequestDto request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username is already taken");
        }

        // Create new user
        UserDto user = UserDto.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .role("TRAVELLER")
                .emailVerified(false)
                .phoneVerified(false)
                .isDeleted(false)
                .build();

        user = userRepository.save(user);

        // Generate email verification token
        String verificationToken = tokenService.createEmailVerificationToken(user.getUserId());
        
        // Send verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);

        // Remove password from response
        user.setPassword(null);

        return AuthResponseDto.builder()
                .user(user)
                .message("Registration successful. Please check your email to verify your account.")
                .build();
    }

    public AuthResponseDto login(LoginRequestDto request) {
        Optional<UserDto> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            throw new BadRequestException("Invalid email or password");
        }

        UserDto user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        if (!user.isEmailVerified()) {
            throw new BadRequestException("Please verify your email before logging in");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());

        // Remove password from response
        user.setPassword(null);

        return AuthResponseDto.builder()
                .token(token)
                .user(user)
                .message("Login successful")
                .build();
    }

    public AuthResponseDto verifyEmail(String token) {
        Long userId = tokenService.validateEmailVerificationToken(token);
        
        userRepository.updateEmailVerified(userId, true);
        
        Optional<UserDto> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }

        UserDto user = userOpt.get();
        user.setPassword(null);

        // Generate JWT token for auto-login after verification
        String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());

        return AuthResponseDto.builder()
                .token(jwtToken)
                .user(user)
                .message("Email verified successfully")
                .build();
    }

    public void forgotPassword(String email) {
        Optional<UserDto> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists for security
            return;
        }

        UserDto user = userOpt.get();
        String resetToken = tokenService.createPasswordResetToken(user.getUserId());
        
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), resetToken);
    }

    public void resetPassword(String token, String newPassword) {
        Long userId = tokenService.validatePasswordResetToken(token);
        
        String encodedPassword = passwordEncoder.encode(newPassword);
        userRepository.updatePassword(userId, encodedPassword);
    }

    public void resendVerificationEmail(String email) {
        Optional<UserDto> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new ResourceNotFoundException("User not found");
        }

        UserDto user = userOpt.get();
        if (user.isEmailVerified()) {
            throw new BadRequestException("Email is already verified");
        }

        String verificationToken = tokenService.createEmailVerificationToken(user.getUserId());
        emailService.sendVerificationEmail(user.getEmail(), user.getFirstName(), verificationToken);
    }
}