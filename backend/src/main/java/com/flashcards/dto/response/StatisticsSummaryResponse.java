package com.flashcards.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Enhanced statistics summary response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsSummaryResponse {

    /**
     * Total number of decks
     */
    private Integer totalDecks;

    /**
     * Total number of cards across all decks
     */
    private Integer totalCards;

    /**
     * Number of cards due for review today
     */
    private Integer cardsDueToday;

    /**
     * Mastery level breakdown
     */
    private MasteryLevelStatistics masteryLevels;

    /**
     * Study time statistics
     */
    private StudyTimeStatisticsResponse studyTime;
}
