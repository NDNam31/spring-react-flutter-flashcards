package com.flashcards.exception;

/**
 * Exception thrown when a deck is not found or has been soft-deleted
 */
public class DeckNotFoundException extends RuntimeException {

    public DeckNotFoundException(String message) {
        super(message);
    }

    public DeckNotFoundException(Long deckId) {
        super("Deck not found: " + deckId);
    }
}
