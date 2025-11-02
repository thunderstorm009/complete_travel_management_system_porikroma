package com.porikroma.service;

import com.porikroma.dto.TripMessageDto;
import com.porikroma.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private SocketIOService socketIOService;

    @Autowired
    @Lazy
    private TripService tripService;

    public List<TripMessageDto> getTripMessages(Long tripId) {
        return chatRepository.findByTripIdOrderByCreatedAt(tripId);
    }

    public TripMessageDto sendMessage(TripMessageDto messageDto) {
        System.out.println("ChatService: Sending message - " + messageDto.getContent());
        messageDto.setCreatedAt(LocalDateTime.now());
        TripMessageDto savedMessage = chatRepository.save(messageDto);
        
        System.out.println("ChatService: Message saved with ID " + savedMessage.getMessageId());
        System.out.println("ChatService: Calling Socket.IO service to broadcast to trip " + savedMessage.getTripId());
        
        // Emit real-time message to trip room
        socketIOService.sendMessageToTrip(savedMessage.getTripId(), savedMessage);
        
        System.out.println("ChatService: Socket.IO broadcast call completed");
        return savedMessage;
    }

    public TripMessageDto updateMessage(Long messageId, String content, Long userId) {
        TripMessageDto message = chatRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getSenderUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to edit this message");
        }
        
        message.setContent(content);
        message.setEdited(true);
        message.setEditedAt(LocalDateTime.now());
        
        TripMessageDto updatedMessage = chatRepository.update(message);
        
        // Emit real-time update
        socketIOService.sendMessageUpdateToTrip(updatedMessage.getTripId(), updatedMessage);
        
        return updatedMessage;
    }

    public void deleteMessage(Long messageId, Long userId) {
        TripMessageDto message = chatRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!message.getSenderUserId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this message");
        }
        
        chatRepository.deleteById(messageId);
        
        // Emit real-time deletion
        socketIOService.sendMessageDeleteToTrip(message.getTripId(), messageId);
    }

    public TripMessageDto votePoll(Long messageId, Long userId, String option) {
        TripMessageDto message = chatRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (!"POLL".equals(message.getMessageType())) {
            throw new RuntimeException("Message is not a poll");
        }
        
        // Update poll votes (implementation depends on how poll data is stored)
        TripMessageDto updatedMessage = chatRepository.updatePollVote(messageId, userId, option);
        
        // Emit real-time poll update
        socketIOService.sendMessageUpdateToTrip(updatedMessage.getTripId(), updatedMessage);
        
        return updatedMessage;
    }

    public TripMessageDto sendSystemMessage(Long tripId, String content) {
        // Get trip creator to use as system message sender (to satisfy foreign key constraint)
        Long creatorUserId = null;
        try {
            // Use a simple query to get trip creator without circular dependency
            creatorUserId = chatRepository.getTripCreatorId(tripId);
        } catch (Exception e) {
            // Fallback: use user ID 1 if available, or skip system message
            creatorUserId = 1L;
        }
        
        TripMessageDto systemMessage = TripMessageDto.builder()
            .tripId(tripId)
            .senderUserId(creatorUserId) // Use creator as sender for system messages
            .messageType("SYSTEM")
            .content(content)
            .createdAt(LocalDateTime.now())
            .build();
        
        return sendMessage(systemMessage);
    }

    public boolean isUserTripMember(Long tripId, Long userId) {
        return tripService.isUserTripMember(tripId, userId);
    }

    public void markMessagesAsRead(Long tripId, Long userId) {
        // Mark all messages in the trip as read for this user
        // This would typically update a user_message_status table
        // For now, this is a placeholder implementation
    }
}