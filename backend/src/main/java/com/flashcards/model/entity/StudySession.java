package com.flashcards.model.entity;

import com.flashcards.model.enums.StudyMode;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entity representing a study session
 * Tracks time spent in different study modes
 */
@Entity
@Table(name = "study_sessions", indexes = {
        @Index(name = "idx_study_sessions_user_id", columnList = "user_id"),
        @Index(name = "idx_study_sessions_mode", columnList = "mode"),
        @Index(name = "idx_study_sessions_start_time", columnList = "start_time")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "deck_id")
    private Long deckId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private StudyMode mode;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "cards_studied")
    private Integer cardsStudied;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (startTime != null && endTime != null) {
            durationSeconds = (int) java.time.Duration.between(startTime, endTime).getSeconds();
        }
    }
}
