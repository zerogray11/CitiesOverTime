package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Comment;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class CommentRepositoryTest {

    @Autowired
    private CommentRepository commentRepository;

    @Test
    public void commentRepository_FindByArticleId_ReturnsCommentList() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        Article article = new Article();
        article.setId(articleId);

        Comment comment = new Comment();
        comment.setArticle(article); // Set the Article object
        commentRepository.save(comment);

        // Act
        List<Comment> comments = commentRepository.findByArticleId(articleId);

        // Assert
        assertNotNull(comments);
        assertFalse(comments.isEmpty());
        assertEquals(1, comments.size());
        assertEquals(articleId, comments.get(0).getArticle().getId());
    }
}