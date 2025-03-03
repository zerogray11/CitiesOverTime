package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Comment;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserService userService; // To fetch the user

    @Autowired
    private ArticleService articleService; // To fetch the article

    // Create a new comment
    public Comment createComment(UUID articleId, UUID userId, String content) {
        // Fetch the Article entity
        Optional<Article> articleOptional = articleService.getArticleById(articleId);
        if (articleOptional.isEmpty()) {
            throw new RuntimeException("Article not found with id: " + articleId);
        }
        Article article = articleOptional.get();

        // Fetch the User entity
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        // Create and save the comment
        Comment comment = new Comment();
        comment.setArticle(article);
        comment.setUser(user);
        comment.setContent(content);
        return commentRepository.save(comment);
    }
    // Add this method to fetch a comment by its ID
    public Comment getCommentById(UUID commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
    }

    // Get all comments for an article
    public List<Comment> getCommentsByArticleId(UUID articleId) {
        return commentRepository.findByArticleId(articleId);
    }

    // Update a comment
    public Comment updateComment(UUID commentId, String newContent) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with id: " + commentId));
        comment.setContent(newContent);
        return commentRepository.save(comment);
    }

    // Delete a comment
    public void deleteComment(UUID commentId) {
        commentRepository.deleteById(commentId);
    }
}