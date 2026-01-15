package com.flashcards.controller;

import com.flashcards.dto.response.SearchResultResponse;
import com.flashcards.model.entity.User;
import com.flashcards.security.CustomUserDetailsService;
import com.flashcards.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Search Controller
 * REST API endpoints for global search functionality
 */
@RestController
@RequestMapping("/api/v1/search")
@RequiredArgsConstructor
@Slf4j
public class SearchController {
    
    private final SearchService searchService;
    private final CustomUserDetailsService userDetailsService;
    
    /**
     * Global search endpoint
     * Searches across decks and cards
     * GET /api/v1/search?q={query}
     *
     * @param userDetails Authenticated user from JWT token
     * @param query Search query string
     * @return SearchResultResponse containing matching decks and cards
     */
    @GetMapping
    public ResponseEntity<SearchResultResponse> search(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(value = "q", defaultValue = "") String query) {
        
        User user = getCurrentUser(userDetails);
        log.info("GET /api/v1/search - userId: {}, query: '{}'", user.getId(), query);
        
        SearchResultResponse response = searchService.search(user, query);
        
        log.debug("Search completed - decks: {}, cards: {}", 
                response.getDecks().size(), response.getCards().size());
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Helper method to get current user from UserDetails
     */
    private User getCurrentUser(UserDetails userDetails) {
        return userDetailsService.getUserByEmail(userDetails.getUsername());
    }
}
