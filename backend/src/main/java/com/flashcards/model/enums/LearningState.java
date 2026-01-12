package com.flashcards.model.enums;

/**
 * Learning State for Spaced Repetition System (SRS)
 * Represents the current learning stage of a card
 */
public enum LearningState {
    /**
     * Card has never been studied before
     */
    NEW,
    
    /**
     * Card is being learned with multiple-choice questions
     */
    LEARNING_MCQ,
    
    /**
     * Card is being learned with typing exercises
     */
    LEARNING_TYPING,
    
    /**
     * Card is in the review phase (graduated from learning)
     */
    REVIEWING,
    
    /**
     * Card was forgotten and needs to be relearned
     */
    RELEARNING
}
