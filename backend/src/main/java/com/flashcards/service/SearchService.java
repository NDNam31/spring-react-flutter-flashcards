package com.flashcards.service;

import com.flashcards.dto.response.CardResponse;
import com.flashcards.dto.response.DeckResponse;
import com.flashcards.dto.response.SearchResultResponse;
import com.flashcards.model.entity.Card;
import com.flashcards.model.entity.Deck;
import com.flashcards.model.entity.User;
import com.flashcards.repository.CardRepository;
import com.flashcards.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Search Service
 * Handles global search functionality across decks and cards
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SearchService {
    
    private final DeckRepository deckRepository;
    private final CardRepository cardRepository;
    private final DeckService deckService;
    private final CardService cardService;
    
    // Limit constants
    private static final int MAX_DECK_RESULTS = 5;
    private static final int MAX_CARD_RESULTS = 10;
    
    /**
     * Perform global search across decks and cards
     *
     * @param user Current authenticated user
     * @param query Search query string
     * @return SearchResultResponse containing matching decks and cards
     */
    public SearchResultResponse search(User user, String query) {
        log.debug("Searching for: '{}' - userId: {}", query, user.getId());
        
        // Validate search query
        if (query == null || query.trim().isEmpty()) {
            log.debug("Empty search query, returning empty results");
            return SearchResultResponse.builder()
                    .decks(List.of())
                    .cards(List.of())
                    .totalDecks(0L)
                    .totalCards(0L)
                    .build();
        }
        
        String searchTerm = query.trim();
        
        // Search decks (limit to MAX_DECK_RESULTS)
        Pageable deckPageable = PageRequest.of(0, MAX_DECK_RESULTS);
        List<Deck> decks = deckRepository.searchDecks(user.getId(), searchTerm, deckPageable);
        long totalDecks = deckRepository.countSearchDecks(user.getId(), searchTerm);
        
        // Search cards (limit to MAX_CARD_RESULTS)
        Pageable cardPageable = PageRequest.of(0, MAX_CARD_RESULTS);
        List<Card> cards = cardRepository.searchCards(user.getId(), searchTerm, cardPageable);
        long totalCards = cardRepository.countSearchCards(user.getId(), searchTerm);
        
        log.debug("Search results: {} decks (total: {}), {} cards (total: {})", 
                decks.size(), totalDecks, cards.size(), totalCards);
        
        // Convert to response DTOs
        List<DeckResponse> deckResponses = decks.stream()
                .map(deckService::toDeckResponse)
                .collect(Collectors.toList());
        
        List<CardResponse> cardResponses = cards.stream()
                .map(card -> cardService.toCardResponse(card, user))
                .collect(Collectors.toList());
        
        return SearchResultResponse.builder()
                .decks(deckResponses)
                .cards(cardResponses)
                .totalDecks(totalDecks)
                .totalCards(totalCards)
                .build();
    }
}
