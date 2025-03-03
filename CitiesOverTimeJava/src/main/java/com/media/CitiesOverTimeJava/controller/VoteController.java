package com.media.CitiesOverTimeJava.controller;

import com.media.CitiesOverTimeJava.dto.VoteRequest;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.model.Vote;
import com.media.CitiesOverTimeJava.security.CustomUserDetails;
import com.media.CitiesOverTimeJava.service.VoteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/votes")
public class VoteController {
    private static final Logger logger = LoggerFactory.getLogger(VoteController.class);

    @Autowired
    private VoteService voteService;

    // Add or update a vote
    @PostMapping("/articles/{articleId}/vote")
    public ResponseEntity<?> addOrUpdateVote(
            @PathVariable UUID articleId,
            @RequestBody VoteRequest voteRequest,
            Authentication authentication) {
        try {
            // Validate the request body
            if (voteRequest == null || voteRequest.getVoteType() == null) {
                return ResponseEntity.badRequest().body("Invalid request body");
            }

            // Log the voteType being received
            System.out.println("Received vote type: " + voteRequest.getVoteType());

            // Get the authenticated user
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Add or update the vote
            Vote vote = voteService.addOrUpdateVote(
                    articleId,
                    "article", // Hardcoded targetType for articles
                    user.getId(), // Pass the userId
                    voteRequest.getVoteType() // Pass the voteType
            );

            return ResponseEntity.ok(vote);
        } catch (RuntimeException e) {
            logger.error("Error adding/updating vote: " + e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    // Get the user's vote for a specific target
    @GetMapping("/user-vote")
    public ResponseEntity<String> getUserVote(
            @RequestParam UUID targetId,
            @RequestParam String targetType) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Cast to CustomUserDetails to get the User entity
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Get the user's vote
            String voteType = voteService.getUserVote(targetId, targetType, user.getId());
            return ResponseEntity.ok(voteType);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Get upvote count for a target
    @GetMapping("/upvotes")
    public ResponseEntity<Long> getUpvoteCount(
            @RequestParam UUID targetId,
            @RequestParam String targetType) {
        try {
            long upvotes = voteService.getUpvoteCount(targetId, targetType);
            return ResponseEntity.ok(upvotes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Get downvote count for a target
    @GetMapping("/downvotes")
    public ResponseEntity<Long> getDownvoteCount(
            @RequestParam UUID targetId,
            @RequestParam String targetType) {
        try {
            long downvotes = voteService.getDownvoteCount(targetId, targetType);
            return ResponseEntity.ok(downvotes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Delete a vote
    @DeleteMapping("/{voteId}")
    public ResponseEntity<Void> deleteVote(@PathVariable UUID voteId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Cast to CustomUserDetails to get the User entity
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Fetch the vote to ensure it belongs to the authenticated user
            Vote vote = voteService.getVoteById(voteId);
            if (!vote.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            // Delete the vote
            voteService.deleteVote(voteId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}