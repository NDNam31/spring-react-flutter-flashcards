package com.flashcards.model.enums;

/**
 * Grade for user's answer quality
 * Used in Spaced Repetition algorithm to adjust card scheduling
 */
public enum Grade {
    /**
     * Complete blackout, incorrect response
     * Card will be marked for relearning
     */
    AGAIN,
    
    /**
     * Correct response, but required significant difficulty
     * Card interval will increase minimally
     */
    HARD,
    
    /**
     * Correct response with some hesitation
     * Card interval will increase normally
     */
    GOOD,
    
    /**
     * Perfect response, no hesitation
     * Card interval will increase significantly
     */
    EASY
}
