package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.User;
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
public class ArticleRepositoryTest {

    @Autowired
    private ArticleRepository articleRepository;

    @Test
    public void articleRepository_FindByAuthorId_ReturnsArticleList() {
        // Arrange
        User author = new User();
        author.setId(UUID.randomUUID());

        Article article = new Article();
        article.setAuthor(author); // Set the User object as the author
        articleRepository.save(article);

        // Act
        List<Article> articles = articleRepository.findByAuthorId(author.getId());

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(author.getId(), articles.get(0).getAuthor().getId());
    }

    @Test
    public void articleRepository_FindByCategory_ReturnsArticleList() {
        // Arrange
        String category = "Technology";
        Article article = new Article();
        article.setCategory(category);
        articleRepository.save(article);

        // Act
        List<Article> articles = articleRepository.findByCategory(category);

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(category, articles.get(0).getCategory());
    }

    @Test
    public void articleRepository_FindByTitleContainingIgnoreCase_ReturnsArticleList() {
        // Arrange
        String title = "Test Article";
        Article article = new Article();
        article.setTitle(title);
        articleRepository.save(article);

        // Act
        List<Article> articles = articleRepository.findByTitleContainingIgnoreCase("test");

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(title, articles.get(0).getTitle());
    }

    @Test
    public void articleRepository_FindByContentContainingIgnoreCase_ReturnsArticleList() {
        // Arrange
        String content = "This is a test article.";
        Article article = new Article();
        article.setContent(content);
        articleRepository.save(article);

        // Act
        List<Article> articles = articleRepository.findByContentContainingIgnoreCase("test");

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(content, articles.get(0).getContent());
    }

    @Test
    public void articleRepository_FindByTitleContainingOrContentContainingIgnoreCase_ReturnsArticleList() {
        // Arrange
        String title = "Test Article";
        String content = "This is a test article.";
        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);
        articleRepository.save(article);

        // Act
        List<Article> articles = articleRepository.findByTitleContainingOrContentContainingIgnoreCase("test", "test");

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(title, articles.get(0).getTitle());
        assertEquals(content, articles.get(0).getContent());
    }

    @Test
    public void articleRepository_FindAll_ReturnsAllArticles() {
        // Arrange
        Article article1 = new Article();
        Article article2 = new Article();
        articleRepository.save(article1);
        articleRepository.save(article2);

        // Act
        List<Article> articles = articleRepository.findAll();

        // Assert
        assertNotNull(articles);
        assertEquals(2, articles.size());
    }
}