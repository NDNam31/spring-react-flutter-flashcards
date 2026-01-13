package com.flashcards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ReviewRequest {
    
    @NotBlank(message = "Grade is required")
    @Pattern(
        regexp = "^(AGAIN|HARD|GOOD|EASY)$", 
        message = "Grade must be one of: AGAIN, HARD, GOOD, EASY"
    )
    private String grade;
}
