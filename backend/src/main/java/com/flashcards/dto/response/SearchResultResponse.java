package com.flashcards.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Search Result Response DTO
 * Contains search results for both decks and cards
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultResponse {
    
    /**
     * List of matching decks
     */
    private List<DeckResponse> decks;
    
    /**
     * List of matching cards
     */
    private List<CardResponse> cards;
    
    /**
     * Total number of decks found (before limit)
     */
    private long totalDecks;
    
    /**
     * Total number of cards found (before limit)
     */
    private long totalCards;
}
