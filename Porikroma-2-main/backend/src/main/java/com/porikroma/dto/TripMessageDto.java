package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripMessageDto {
    private Long messageId;
    private Long tripId;
    private Long senderUserId;
    private String senderName;
    private String senderProfilePicture;
    private String messageType;  // TEXT, IMAGE, FILE, LOCATION, SYSTEM, POLL
    private String content;
    private String attachmentUrl;
    private List<String> pollOptions;
    private Long replyToMessageId;
    private String replyToContent;
    private String replyToSenderName;
    private boolean isEdited;
    private LocalDateTime editedAt;
    private LocalDateTime createdAt;
}