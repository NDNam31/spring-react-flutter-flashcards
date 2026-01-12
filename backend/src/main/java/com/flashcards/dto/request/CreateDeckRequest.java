package com.flashcards.dto.request;

import com.flashcards.model.enums.SourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new deck
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDeckRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must not exceed 255 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @Builder.Default
    private SourceType sourceType = SourceType.LOCAL;

    private String sourceId;
}
