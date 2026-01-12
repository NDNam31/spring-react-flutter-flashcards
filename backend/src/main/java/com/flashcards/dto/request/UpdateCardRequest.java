package com.flashcards.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request DTO for updating an existing card
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCardRequest {

    @NotBlank(message = "Term is required")
    private String term;

    @NotBlank(message = "Definition is required")
    private String definition;

    private String example;

    private String imageUrl;

    private String audioUrl;

    private List<String> tags;
}
