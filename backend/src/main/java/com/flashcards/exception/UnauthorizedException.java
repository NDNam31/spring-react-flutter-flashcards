package com.flashcards.exception;

/**
 * Exception thrown when a user attempts to access a resource they don't own
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("You do not have permission to access this resource");
    }
}
