package com.flashcards.model.entity;

import com.flashcards.model.enums.LearningState;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Card Progress Entity
 * Tracks the Spaced Repetition System (SRS) progress for each user-card combination
 * Implements the SM-2 algorithm for optimal learning intervals
 */
@Entity
@Table(name = "card_progress", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_card", columnNames = {"user_id", "card_id"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CardProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "card_id", nullable = false)
    private Long cardId;

    @Enumerated(EnumType.STRING)
    @Column(name = "learning_state", nullable = false, length = 30)
    @Builder.Default
    private LearningState learningState = LearningState.NEW;

    @Column(name = "next_review")
    private LocalDateTime nextReview;

    @Column(nullable = false)
    @Builder.Default
    private Integer interval = 0;

    @Column(name = "ease_factor", nullable = false)
    @Builder.Default
    private Float easeFactor = 2.5f;

    @Column(nullable = false)
    @Builder.Default
    private Integer repetitions = 0;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", insertable = false, updatable = false)
    private Card card;
}
