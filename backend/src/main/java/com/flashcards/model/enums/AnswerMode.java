package com.flashcards.model.enums;

/**
 * Answer Mode Enum for Test Configuration
 * Determines the direction of questions in test mode
 */
public enum AnswerMode {
    /**
     * TERM: Show definition as question, user answers with term
     * Question: Definition
     * Answer: Term
     */
    TERM,
    
    /**
     * DEFINITION: Show term as question, user answers with definition
     * Question: Term
     * Answer: Definition
     */
    DEFINITION,
    
    /**
     * MIXED: Randomly mix both modes for each question
     * Some questions show definition → term
     * Some questions show term → definition
     */
    MIXED
}
