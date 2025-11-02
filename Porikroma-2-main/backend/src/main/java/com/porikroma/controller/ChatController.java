package com.porikroma.controller;

import com.porikroma.dto.TripMessageDto;
import com.porikroma.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/trips/{tripId}/messages")
    public ResponseEntity<List<TripMessageDto>> getTripMessages(@PathVariable Long tripId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // Check if user is a member of this trip before allowing access to messages
        if (!chatService.isUserTripMember(tripId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        List<TripMessageDto> messages = chatService.getTripMessages(tripId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/trips/{tripId}/messages")
    public ResponseEntity<TripMessageDto> sendMessage(
            @PathVariable Long tripId,
            @RequestBody TripMessageDto messageDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        messageDto.setTripId(tripId);
        messageDto.setSenderUserId(userId);
        TripMessageDto sentMessage = chatService.sendMessage(messageDto);
        return ResponseEntity.ok(sentMessage);
    }

    @PutMapping("/messages/{messageId}")
    public ResponseEntity<TripMessageDto> updateMessage(
            @PathVariable Long messageId,
            @RequestBody TripMessageDto messageDto,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        TripMessageDto updatedMessage = chatService.updateMessage(messageId, messageDto.getContent(), userId);
        return ResponseEntity.ok(updatedMessage);
    }

    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long messageId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        chatService.deleteMessage(messageId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/messages/{messageId}/poll-vote")
    public ResponseEntity<TripMessageDto> votePoll(
            @PathVariable Long messageId,
            @RequestBody String option,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        TripMessageDto updatedMessage = chatService.votePoll(messageId, userId, option);
        return ResponseEntity.ok(updatedMessage);
    }

    @PostMapping("/trips/{tripId}/messages/mark-read")
    public ResponseEntity<Void> markMessagesAsRead(
            @PathVariable Long tripId,
            HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        // Check if user is a member of this trip before allowing to mark messages as read
        if (!chatService.isUserTripMember(tripId, userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        chatService.markMessagesAsRead(tripId, userId);
        return ResponseEntity.ok().build();
    }
}