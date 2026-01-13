package com.flashcards.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long cardId;
    private Float easeFactor;
    private Integer interval;
    private Integer repetitions;
    private LocalDateTime nextReview;
    private LocalDateTime lastReview;
    private String learningState;
}
