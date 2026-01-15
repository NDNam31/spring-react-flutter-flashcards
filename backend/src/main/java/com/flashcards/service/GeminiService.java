package com.flashcards.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.flashcards.dto.response.AiCardResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Service for interacting with Google Gemini API
 * Generates flashcards using AI
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.url}")
    private String apiUrl;
    
    @Value("${gemini.max.cards:20}")
    private int maxCards;
    
    /**
     * Generate flashcards using Google Gemini API
     *
     * @param topic Topic to generate flashcards about
     * @param quantity Number of flashcards to generate
     * @param language Target language for definitions
     * @return List of AI-generated flashcards
     */
    public List<AiCardResponse> generateCards(String topic, int quantity, String language) {
        log.info("Generating {} flashcards about: '{}' in {}", quantity, topic, language);
        
        // Validate quantity
        if (quantity > maxCards) {
            log.warn("Requested quantity {} exceeds max {}. Limiting to {}", quantity, maxCards, maxCards);
            quantity = maxCards;
        }
        
        try {
            // Build prompt with careful engineering
            String prompt = buildPrompt(topic, quantity, language);
            
            // Call Gemini API
            String responseText = callGeminiApi(prompt);
            
            // Parse JSON response
            List<AiCardResponse> cards = parseGeminiResponse(responseText);
            
            log.info("Successfully generated {} flashcards", cards.size());
            return cards;
            
        } catch (Exception e) {
            log.error("Error generating flashcards: {}", e.getMessage(), e);
            throw new RuntimeException("AI service is temporarily unavailable. Please try again later.", e);
        }
    }
    
    /**
     * Build prompt for Gemini API with careful engineering
     * Critical: Must return ONLY raw JSON array without markdown
     */
    private String buildPrompt(String topic, int quantity, String language) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Create exactly ").append(quantity).append(" flashcards about '").append(topic).append("'.\n\n");
        
        prompt.append("CRITICAL REQUIREMENTS:\n");
        prompt.append("1. Return ONLY a raw JSON array. No markdown code blocks, no explanations, no extra text.\n");
        prompt.append("2. Each flashcard must have: term, definition, example\n");
        prompt.append("3. Definition language: ").append(language).append("\n");
        prompt.append("4. Term should be concise (1-5 words)\n");
        prompt.append("5. Definition should be clear and educational (20-100 words)\n");
        prompt.append("6. Example should demonstrate usage (10-50 words)\n\n");
        
        prompt.append("JSON FORMAT (exact structure required):\n");
        prompt.append("[\n");
        prompt.append("  {\"term\": \"example term\", \"definition\": \"clear definition\", \"example\": \"usage example\"},\n");
        prompt.append("  {\"term\": \"another term\", \"definition\": \"another definition\", \"example\": \"another example\"}\n");
        prompt.append("]\n\n");
        
        prompt.append("Generate ").append(quantity).append(" flashcards NOW:");
        
        log.debug("Built prompt: {}", prompt);
        return prompt.toString();
    }
    
    /**
     * Call Google Gemini API
     */
    private String callGeminiApi(String prompt) {
        String url = apiUrl + "?key=" + apiKey;
        
        // Build request body according to Gemini API spec
        Map<String, Object> requestBody = new HashMap<>();
        
        // Contents array
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        
        // Parts array
        List<Map<String, String>> parts = new ArrayList<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", prompt);
        parts.add(part);
        
        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);
        
        // Generation config for JSON output
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 8192);  // Tăng lên 8192 cho đủ chỗ tiếng Việt
        requestBody.put("generationConfig", generationConfig);
        
        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        log.debug("Calling Gemini API...");
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
        
        if (response.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("Gemini API returned status: " + response.getStatusCode());
        }
        
        // Extract text from response
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            
            if (candidates.isEmpty()) {
                throw new RuntimeException("No candidates in Gemini response");
            }
            
            JsonNode candidate = candidates.get(0);
            
            // Check finish reason to detect truncation
            String finishReason = candidate.path("finishReason").asText("UNKNOWN");
            log.info("Gemini finish reason: {}", finishReason);
            
            // Log full response for debugging
            log.debug("Full Gemini API response: {}", response.getBody());
            
            String text = candidate
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
            
            log.info("Gemini response text length: {} characters", text.length());
            log.debug("Gemini response text: {}", text);
            return text;
            
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }
    
    /**
     * Parse Gemini response and extract JSON array
     * Handles cases where AI includes markdown code blocks
     */
    private List<AiCardResponse> parseGeminiResponse(String responseText) {
        try {
            // Clean response text
            String cleanedText = cleanJsonResponse(responseText);
            
            // Parse JSON array
            List<AiCardResponse> cards = objectMapper.readValue(
                    cleanedText, 
                    new TypeReference<List<AiCardResponse>>() {}
            );
            
            if (cards == null || cards.isEmpty()) {
                throw new RuntimeException("AI returned empty result");
            }
            
            // Validate cards
            cards.forEach(card -> {
                if (card.getTerm() == null || card.getTerm().trim().isEmpty()) {
                    throw new RuntimeException("AI generated invalid card (missing term)");
                }
                if (card.getDefinition() == null || card.getDefinition().trim().isEmpty()) {
                    throw new RuntimeException("AI generated invalid card (missing definition)");
                }
                // Example can be null/empty
                if (card.getExample() == null) {
                    card.setExample("");
                }
            });
            
            return cards;
            
        } catch (Exception e) {
            log.error("Failed to parse JSON: {}", responseText, e);
            throw new RuntimeException("AI returned invalid format. Please try again.", e);
        }
    }
    
    /**
     * Clean JSON response from markdown code blocks and extra text
     */
    private String cleanJsonResponse(String text) {
        if (text == null || text.trim().isEmpty()) {
            throw new RuntimeException("AI returned empty response");
        }
        
        // Remove markdown code blocks ```json ... ```
        Pattern codeBlockPattern = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)```");
        Matcher matcher = codeBlockPattern.matcher(text);
        if (matcher.find()) {
            text = matcher.group(1).trim();
            log.debug("Extracted from code block");
        }
        
        // Find JSON array boundaries
        int startIndex = text.indexOf('[');
        int endIndex = text.lastIndexOf(']');
        
        if (startIndex == -1 || endIndex == -1 || startIndex >= endIndex) {
            log.error("Invalid JSON structure. Text length: {}, startIndex: {}, endIndex: {}", 
                     text.length(), startIndex, endIndex);
            log.error("Response text (first 500 chars): {}", 
                     text.length() > 500 ? text.substring(0, 500) : text);
            log.error("Response text (last 500 chars): {}", 
                     text.length() > 500 ? text.substring(text.length() - 500) : text);
            throw new RuntimeException("No valid JSON array found in response - possibly truncated");
        }
        
        String jsonArray = text.substring(startIndex, endIndex + 1);
        log.debug("Cleaned JSON: {}", jsonArray);
        
        return jsonArray;
    }
}
