package com.porikroma.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {
    private Long reviewId;
    private Long userId;
    private String userName;
    private String userProfilePicture;
    private String entityType;  // DESTINATION, SUB_DESTINATION, ACCOMMODATION, TRANSPORT
    private Long entityId;
    private String entityName;
    private Long tripId;
    private String tripName;
    private BigDecimal rating;  // 1.0 to 5.0
    private String reviewTitle;
    private String reviewContent;
    private List<String> photos;
    private boolean isPublic;
    private Integer helpfulVotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}