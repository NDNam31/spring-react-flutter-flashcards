package com.flashcards.repository;

import com.flashcards.model.entity.StudySession;
import com.flashcards.model.enums.StudyMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository for StudySession entity
 */
@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {

    /**
     * Find all study sessions for a user
     */
    List<StudySession> findByUserIdOrderByStartTimeDesc(Long userId);

    /**
     * Find study sessions by user and mode
     */
    List<StudySession> findByUserIdAndMode(Long userId, StudyMode mode);

    /**
     * Get total study time (in seconds) for a user
     */
    @Query("SELECT COALESCE(SUM(s.durationSeconds), 0) FROM StudySession s WHERE s.userId = :userId")
    Long getTotalStudyTimeByUserId(@Param("userId") Long userId);

    /**
     * Get total study time by mode for a user
     */
    @Query("SELECT COALESCE(SUM(s.durationSeconds), 0) FROM StudySession s WHERE s.userId = :userId AND s.mode = :mode")
    Long getTotalStudyTimeByUserIdAndMode(@Param("userId") Long userId, @Param("mode") StudyMode mode);

    /**
     * Get study sessions within a date range
     */
    @Query("SELECT s FROM StudySession s WHERE s.userId = :userId AND s.startTime >= :startDate AND s.endTime <= :endDate ORDER BY s.startTime DESC")
    List<StudySession> findByUserIdAndDateRange(@Param("userId") Long userId, 
                                                 @Param("startDate") LocalDateTime startDate, 
                                                 @Param("endDate") LocalDateTime endDate);

    /**
     * Delete all sessions for a user
     */
    void deleteByUserId(Long userId);

    /**
     * Get total study time for a specific deck
     */
    @Query("SELECT COALESCE(SUM(s.durationSeconds), 0) FROM StudySession s WHERE s.userId = :userId AND s.deckId = :deckId")
    Long getTotalStudyTimeByDeck(@Param("userId") Long userId, @Param("deckId") Long deckId);

    /**
     * Get study time by mode for a specific deck
     */
    @Query("SELECT COALESCE(SUM(s.durationSeconds), 0) FROM StudySession s WHERE s.userId = :userId AND s.mode = :mode AND s.deckId = :deckId")
    Long getStudyTimeByModeAndDeck(@Param("userId") Long userId, @Param("mode") StudyMode mode, @Param("deckId") Long deckId);

    /**
     * Find sessions by user, mode and deck
     */
    List<StudySession> findByUserIdAndModeAndDeckIdOrderByStartTimeDesc(Long userId, StudyMode mode, Long deckId);

    /**
     * Find sessions by user and mode
     */
    List<StudySession> findByUserIdAndModeOrderByStartTimeDesc(Long userId, StudyMode mode);
}
