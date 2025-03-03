package com.media.CitiesOverTimeJava.controller;

import com.media.CitiesOverTimeJava.dto.FavoriteDTO;
import com.media.CitiesOverTimeJava.dto.FavoriteRequest;
import com.media.CitiesOverTimeJava.model.Favorite;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.security.CustomUserDetails;
import com.media.CitiesOverTimeJava.service.FavoriteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private static final Logger logger = LoggerFactory.getLogger(FavoriteController.class);

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping("/isFavorited")
    public ResponseEntity<Boolean> isArticleFavoritedByUser(
            @RequestParam UUID articleId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract User from CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUser().getId();

        logger.info("Checking if article {} is favorited by user {}", articleId, userId);

        boolean isFavorited = favoriteService.isArticleFavoritedByUser(userId, articleId);
        logger.info("Article {} is favorited by user {}: {}", articleId, userId, isFavorited);

        return ResponseEntity.ok(isFavorited);
    }
    @GetMapping("/user")
    public ResponseEntity<List<FavoriteDTO>> getFavoriteArticlesByUser(Authentication authentication) {
        try {
            // Extract User from CustomUserDetails
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            UUID userId = userDetails.getUser().getId();

            // Fetch the favorite articles for the user
            List<FavoriteDTO> favoriteDTOs = favoriteService.getFavoriteDTOsByUser(userId);
            return ResponseEntity.ok(favoriteDTOs);
        } catch (Exception e) {
            logger.error("Error fetching favorite articles: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping
    public ResponseEntity<?> addFavorite(
            @RequestBody FavoriteRequest favoriteRequest,
            Authentication authentication) {
        try {
            // Validate the request body
            if (favoriteRequest == null || favoriteRequest.getArticleId() == null) {
                return ResponseEntity.badRequest().body("Invalid request body");
            }

            // Extract User from CustomUserDetails
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Add the favorite
            Favorite favorite = favoriteService.addFavorite(
                    favoriteRequest.getArticleId(),
                    user.getId()
            );

            return ResponseEntity.ok(favorite);
        } catch (RuntimeException e) {
            logger.error("Error adding favorite: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @DeleteMapping
    public ResponseEntity<Void> removeFavorite(
            @RequestParam UUID articleId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract User from CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UUID userId = userDetails.getUser().getId();

        favoriteService.removeFavorite(userId, articleId);
        return ResponseEntity.noContent().build();
    }
}