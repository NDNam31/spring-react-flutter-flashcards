package com.flashcards.dto.response;

import com.flashcards.model.enums.StudyMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for StudySession
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySessionResponse {

    private Long id;
    private Long userId;
    private Long deckId;
    private StudyMode mode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationSeconds;
    private Integer cardsStudied;
    private LocalDateTime createdAt;
}
