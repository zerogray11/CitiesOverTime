package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.ArticleRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ArticleServiceTest {

    @Mock
    private ArticleRepository articleRepository;

    @InjectMocks
    private ArticleService articleService;

    @Test
    public void articleService_CreateArticle_ReturnsArticle() {
        // Arrange
        Article article = new Article();
        when(articleRepository.save(any(Article.class))).thenReturn(article);

        // Act
        Article createdArticle = articleService.createArticle(article);

        // Assert
        assertNotNull(createdArticle);
        verify(articleRepository, times(1)).save(article);
    }

    @Test
    public void articleService_GetArticlesByAuthor_ReturnsArticleList() {
        // Arrange
        UUID authorId = UUID.randomUUID();
        User author = new User();
        author.setId(authorId);

        Article article = new Article();
        article.setAuthor(author);

        when(articleRepository.findByAuthorId(authorId)).thenReturn(Collections.singletonList(article));

        // Act
        List<Article> articles = articleService.getArticlesByAuthor(authorId);

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(authorId, articles.get(0).getAuthor().getId());
    }

    @Test
    public void articleService_GetAllArticles_ReturnsAllArticles() {
        // Arrange
        Article article1 = new Article();
        Article article2 = new Article();

        when(articleRepository.findAll()).thenReturn(Arrays.asList(article1, article2));

        // Act
        List<Article> articles = articleService.getAllArticles();

        // Assert
        assertNotNull(articles);
        assertEquals(2, articles.size());
    }

    @Test
    public void articleService_GetArticlesByCategory_ReturnsArticleList() {
        // Arrange
        String category = "Technology";
        Article article = new Article();
        article.setCategory(category);

        when(articleRepository.findByCategory(category)).thenReturn(Collections.singletonList(article));

        // Act
        List<Article> articles = articleService.getArticlesByCategory(category);

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals(category, articles.get(0).getCategory());
    }

    @Test
    public void articleService_DeleteArticle_DeletesArticle() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        doNothing().when(articleRepository).deleteById(articleId);

        // Act
        articleService.deleteArticle(articleId);

        // Assert
        verify(articleRepository, times(1)).deleteById(articleId);
    }

    @Test
    public void articleService_GetArticleById_ReturnsArticle() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        Article article = new Article();
        article.setId(articleId);

        when(articleRepository.findById(articleId)).thenReturn(Optional.of(article));

        // Act
        Optional<Article> foundArticle = articleService.getArticleById(articleId);

        // Assert
        assertTrue(foundArticle.isPresent());
        assertEquals(articleId, foundArticle.get().getId());
    }

    @Test
    public void articleService_UpdateArticle_ReturnsUpdatedArticle() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        Article existingArticle = new Article();
        existingArticle.setId(articleId);
        existingArticle.setTitle("Old Title");

        Article updatedArticle = new Article();
        updatedArticle.setTitle("New Title");

        when(articleRepository.findById(articleId)).thenReturn(Optional.of(existingArticle));
        when(articleRepository.save(any(Article.class))).thenReturn(updatedArticle);

        // Act
        Article result = articleService.updateArticle(articleId, updatedArticle);

        // Assert
        assertNotNull(result);
        assertEquals("New Title", result.getTitle());
    }

    @Test
    public void articleService_SearchArticlesByKeyword_ReturnsArticleList() {
        // Arrange
        String keyword = "test";
        Article article = new Article();
        article.setTitle("Test Article");

        when(articleRepository.findByTitleContainingOrContentContainingIgnoreCase(keyword, keyword))
                .thenReturn(Collections.singletonList(article));

        // Act
        List<Article> articles = articleService.searchArticlesByKeyword(keyword);

        // Assert
        assertNotNull(articles);
        assertEquals(1, articles.size());
        assertEquals("Test Article", articles.get(0).getTitle());
    }

    @Test
    public void articleService_PartialUpdateArticle_ReturnsUpdatedArticle() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        Article existingArticle = new Article();
        existingArticle.setId(articleId);
        existingArticle.setTitle("Old Title");

        Map<String, Object> updates = new HashMap<>();
        updates.put("title", "New Title");

        when(articleRepository.findById(articleId)).thenReturn(Optional.of(existingArticle));
        when(articleRepository.save(any(Article.class))).thenReturn(existingArticle);

        // Act
        Article result = articleService.partialUpdateArticle(articleId, updates);

        // Assert
        assertNotNull(result);
        assertEquals("New Title", result.getTitle());
    }
}