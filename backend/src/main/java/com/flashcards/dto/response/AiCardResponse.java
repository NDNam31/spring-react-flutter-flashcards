package com.flashcards.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for AI-generated flashcard
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiCardResponse {
    
    /**
     * Front side of the flashcard (term/question)
     */
    private String term;
    
    /**
     * Back side of the flashcard (definition/answer)
     */
    private String definition;
    
    /**
     * Example usage or sentence
     */
    private String example;
}
