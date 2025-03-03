package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Comment;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.CommentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService;

    @Test
    public void commentService_CreateComment_ReturnsComment() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        String content = "Test comment";

        Article article = new Article();
        article.setId(articleId);

        User user = new User();
        user.setId(userId);

        Comment comment = new Comment();
        comment.setArticle(article);
        comment.setUser(user);
        comment.setContent(content);

        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        // Act
        Comment createdComment = commentService.createComment(articleId, userId, content);

        // Assert
        assertNotNull(createdComment);
        assertEquals(articleId, createdComment.getArticle().getId());
        assertEquals(userId, createdComment.getUser().getId());
        assertEquals(content, createdComment.getContent());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    public void commentService_GetCommentById_ReturnsComment() {
        // Arrange
        UUID commentId = UUID.randomUUID();
        Comment comment = new Comment();
        comment.setId(commentId);

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        // Act
        Comment foundComment = commentService.getCommentById(commentId);

        // Assert
        assertNotNull(foundComment);
        assertEquals(commentId, foundComment.getId());
    }

    @Test
    public void commentService_GetCommentsByArticleId_ReturnsCommentList() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        Comment comment = new Comment();
        comment.setArticle(new Article());

        when(commentRepository.findByArticleId(articleId)).thenReturn(List.of(comment));

        // Act
        List<Comment> comments = commentService.getCommentsByArticleId(articleId);

        // Assert
        assertNotNull(comments);
        assertEquals(1, comments.size());
    }

    @Test
    public void commentService_UpdateComment_ReturnsUpdatedComment() {
        // Arrange
        UUID commentId = UUID.randomUUID();
        String newContent = "Updated comment content";

        Comment existingComment = new Comment();
        existingComment.setId(commentId);
        existingComment.setContent("Old content");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(any(Comment.class))).thenReturn(existingComment);

        // Act
        Comment updatedComment = commentService.updateComment(commentId, newContent);

        // Assert
        assertNotNull(updatedComment);
        assertEquals(newContent, updatedComment.getContent());
    }

    @Test
    public void commentService_DeleteComment_DeletesComment() {
        // Arrange
        UUID commentId = UUID.randomUUID();

        doNothing().when(commentRepository).deleteById(commentId);

        // Act
        commentService.deleteComment(commentId);

        // Assert
        verify(commentRepository, times(1)).deleteById(commentId);
    }
}