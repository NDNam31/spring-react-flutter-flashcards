package com.flashcards.exception;

/**
 * Exception thrown when a card is not found or has been soft-deleted
 */
public class CardNotFoundException extends RuntimeException {

    public CardNotFoundException(String message) {
        super(message);
    }

    public CardNotFoundException(Long cardId) {
        super("Card not found: " + cardId);
    }
}
