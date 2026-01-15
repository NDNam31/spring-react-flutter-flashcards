package com.flashcards.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for AI-powered flashcard generation
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiGenerateRequest {
    
    /**
     * Topic to generate flashcards about
     * Example: "IELTS Vocabulary - Environment", "Japanese Greetings"
     */
    @NotBlank(message = "Topic is required")
    @Size(min = 3, max = 200, message = "Topic must be between 3 and 200 characters")
    private String topic;
    
    /**
     * Number of flashcards to generate
     * Default: 10, Max: 20
     */
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 20, message = "Quantity cannot exceed 20")
    private Integer quantity;
    
    /**
     * Target language for definitions
     * Example: "Vietnamese", "English", "Japanese"
     * Default: "Vietnamese"
     */
    @NotBlank(message = "Language is required")
    private String language;
}
