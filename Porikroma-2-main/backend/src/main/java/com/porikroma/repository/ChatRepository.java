package com.porikroma.repository;

import com.porikroma.dto.TripMessageDto;

import java.util.List;
import java.util.Optional;

public interface ChatRepository {
    List<TripMessageDto> findByTripIdOrderByCreatedAt(Long tripId);
    TripMessageDto save(TripMessageDto messageDto);
    Optional<TripMessageDto> findById(Long messageId);
    TripMessageDto update(TripMessageDto messageDto);
    void deleteById(Long messageId);
    TripMessageDto updatePollVote(Long messageId, Long userId, String option);
    List<TripMessageDto> findRecentMessages(Long tripId, int limit);
    Long getTripCreatorId(Long tripId);
}