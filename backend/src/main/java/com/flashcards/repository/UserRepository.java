package com.flashcards.repository;

import com.flashcards.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * User Repository
 * Data access layer for User entity
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email address
     * Used for authentication and registration validation
     *
     * @param email User's email address
     * @return Optional containing User if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if email already exists in the system
     * Used for registration validation
     *
     * @param email Email to check
     * @return true if email exists, false otherwise
     */
    boolean existsByEmail(String email);
}
