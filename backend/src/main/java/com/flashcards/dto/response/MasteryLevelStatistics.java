package com.flashcards.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for mastery level statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MasteryLevelStatistics {

    /**
     * New cards (never studied)
     */
    private Integer newCards;

    /**
     * Still learning (LEARNING or RELEARNING state)
     */
    private Integer stillLearning;

    /**
     * Almost done (REVIEWING with interval < 21 days)
     */
    private Integer almostDone;

    /**
     * Mastered (interval >= 21 days)
     */
    private Integer mastered;

    /**
     * Total cards
     */
    private Integer total;

    /**
     * Percentage of each level (0-100)
     */
    private Double newCardsPercentage;
    private Double stillLearningPercentage;
    private Double almostDonePercentage;
    private Double masteredPercentage;
}
