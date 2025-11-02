package com.porikroma.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.name}")
    private String appName;

    @Value("${app.base-url}")
    private String baseUrl;

    public void sendVerificationEmail(String toEmail, String firstName, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verify Your Email - " + appName);
        
        String text = String.format("""
            Hi %s,
            
            Welcome to %s! Please verify your email address using the 6-digit PIN below:
            
            Your Verification PIN: %s
            
            Enter this PIN in the verification page to activate your account.
            
            This PIN will expire in 24 hours.
            
            If you didn't create an account with us, please ignore this email.
            
            Best regards,
            The %s Team
            """, firstName, appName, token, appName);
        
        message.setText(text);
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String firstName, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Reset Your Password - " + appName);
        
        String text = String.format("""
            Hi %s,
            
            You requested to reset your password for your %s account. Use the 6-digit PIN below to reset it:
            
            Your Password Reset PIN: %s
            
            Enter this PIN in the password reset page along with your new password.
            
            This PIN will expire in 1 hour.
            
            If you didn't request a password reset, please ignore this email.
            
            Best regards,
            The %s Team
            """, firstName, appName, token, appName);
        
        message.setText(text);
        mailSender.send(message);
    }

    public void sendWelcomeEmail(String toEmail, String firstName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to " + appName + "!");
        
        String text = String.format("""
            Hi %s,
            
            Welcome to %s! Your email has been verified successfully.
            
            You can now:
            - Plan amazing trips with friends
            - Discover new destinations
            - Track expenses and split costs
            - Connect with fellow travelers
            
            Start your journey by visiting: %s
            
            Happy traveling!
            
            Best regards,
            The %s Team
            """, firstName, appName, baseUrl, appName);
        
        message.setText(text);
        mailSender.send(message);
    }
}