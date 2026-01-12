package com.flashcards.dto.request;

import com.flashcards.model.enums.Grade;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for reviewing a card
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {

    @NotNull(message = "Grade is required")
    private Grade grade;

    private Integer timeTakenMs;
}
