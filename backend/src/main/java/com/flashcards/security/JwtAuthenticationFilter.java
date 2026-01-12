package com.flashcards.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT Authentication Filter
 * Intercepts every request to validate JWT token and set authentication in SecurityContext
 * 
 * Flow:
 * 1. Extract JWT token from Authorization header
 * 2. Validate token and extract username
 * 3. Load user details from database
 * 4. Create authentication and set in SecurityContext
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // Extract JWT token from request
            String jwt = extractJwtFromRequest(request);

            // Validate and authenticate
            if (jwt != null && jwtUtils.validateToken(jwt)) {
                String email = jwtUtils.extractUsername(jwt);
                
                log.debug("JWT token valid for user: {}", email);

                // Load user details
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // Validate token against user details
                if (jwtUtils.validateToken(jwt, userDetails)) {
                    // Create authentication token
                    UsernamePasswordAuthenticationToken authentication = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );

                    authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // Set authentication in SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    
                    log.debug("Authentication set for user: {}", email);
                } else {
                    log.warn("JWT token validation failed for user: {}", email);
                }
            } else if (jwt != null) {
                log.warn("Invalid or expired JWT token");
            }
        } catch (Exception ex) {
            log.error("Cannot set user authentication: {}", ex.getMessage(), ex);
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token from Authorization header
     * Expected format: "Bearer <token>"
     *
     * @param request HTTP request
     * @return JWT token or null if not found
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7);
            log.debug("JWT token extracted from Authorization header");
            return token;
        }

        return null;
    }
}
