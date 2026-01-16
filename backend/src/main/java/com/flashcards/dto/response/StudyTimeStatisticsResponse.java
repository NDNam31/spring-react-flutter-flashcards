package com.flashcards.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.List;

/**
 * Response DTO for study time statistics
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudyTimeStatisticsResponse {

    /**
     * Total study time in seconds across all modes
     */
    private Long totalSeconds;

    /**
     * Study time per mode in seconds
     * Keys: "learn", "test", "match", "review", "srs"
     */
    private Map<String, Long> timeByMode;

    /**
     * Formatted total time (e.g., "1h 30m")
     */
    private String totalFormatted;

    /**
     * Formatted time per mode
     */
    private Map<String, String> timeByModeFormatted;

    /**
     * Detailed statistics for each mode
     */
    private Map<String, ModeStatisticsDetail> modeDetails;
}
