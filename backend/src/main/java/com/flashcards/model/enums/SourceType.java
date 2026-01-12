package com.flashcards.model.enums;

/**
 * Source Type for Deck
 * Indicates where the deck was created or imported from
 */
public enum SourceType {
    /**
     * Deck created locally in the application
     */
    LOCAL,
    
    /**
     * Deck imported from Anki
     */
    ANKI,
    
    /**
     * Deck imported from Quizlet
     */
    QUIZLET
}
