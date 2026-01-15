package com.flashcards.controller;

import com.flashcards.dto.request.AiGenerateRequest;
import com.flashcards.dto.response.AiCardResponse;
import com.flashcards.model.entity.User;
import com.flashcards.security.CustomUserDetailsService;
import com.flashcards.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AI Controller
 * REST API endpoints for AI-powered flashcard generation
 */
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {
    
    private final GeminiService geminiService;
    private final CustomUserDetailsService userDetailsService;
    
    /**
     * Generate flashcards using AI
     * POST /api/v1/ai/generate
     *
     * @param userDetails Authenticated user from JWT token
     * @param request AI generation request (topic, quantity, language)
     * @return List of AI-generated flashcards
     */
    @PostMapping("/generate")
    public ResponseEntity<List<AiCardResponse>> generateFlashcards(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AiGenerateRequest request) {
        
        User user = getCurrentUser(userDetails);
        log.info("POST /api/v1/ai/generate - userId: {}, topic: '{}', quantity: {}", 
                user.getId(), request.getTopic(), request.getQuantity());
        
        List<AiCardResponse> cards = geminiService.generateCards(
                request.getTopic(),
                request.getQuantity(),
                request.getLanguage()
        );
        
        log.debug("Generated {} flashcards for user {}", cards.size(), user.getId());
        return ResponseEntity.ok(cards);
    }
    
    /**
     * Helper method to get current user from UserDetails
     */
    private User getCurrentUser(UserDetails userDetails) {
        return userDetailsService.getUserByEmail(userDetails.getUsername());
    }
}
