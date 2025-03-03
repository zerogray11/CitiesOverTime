package com.media.CitiesOverTimeJava.controller;

import com.media.CitiesOverTimeJava.model.Comment;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.security.CustomUserDetails;
import com.media.CitiesOverTimeJava.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Create a new comment for an article
    @PostMapping("/article/{articleId}")
    public ResponseEntity<?> addComment(@PathVariable UUID articleId, @RequestBody String content) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(403).body("User not authenticated");
            }

            // Cast to CustomUserDetails to get the User entity
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Create the comment
            Comment comment = commentService.createComment(articleId, user.getId(), content);

            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all comments for an article
    @GetMapping("/article/{articleId}")
    public ResponseEntity<?> getCommentsByArticleId(@PathVariable UUID articleId) {
        try {
            List<Comment> comments = commentService.getCommentsByArticleId(articleId);
            return ResponseEntity.ok(comments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update a comment
    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable UUID commentId, @RequestBody String newContent) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(403).body("User not authenticated");
            }

            // Cast to CustomUserDetails to get the User entity
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Fetch the comment to ensure it belongs to the authenticated user
            Comment comment = commentService.getCommentById(commentId);
            if (!comment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You are not authorized to update this comment");
            }

            // Update the comment
            Comment updatedComment = commentService.updateComment(commentId, newContent);
            return ResponseEntity.ok(updatedComment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete a comment
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable UUID commentId) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(403).body("User not authenticated");
            }

            // Cast to CustomUserDetails to get the User entity
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // Fetch the comment to ensure it belongs to the authenticated user
            Comment comment = commentService.getCommentById(commentId);
            if (!comment.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You are not authorized to delete this comment");
            }

            // Delete the comment
            commentService.deleteComment(commentId);
            return ResponseEntity.ok("Comment deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}