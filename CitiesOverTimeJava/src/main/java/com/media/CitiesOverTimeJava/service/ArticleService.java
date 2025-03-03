package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;

    // Create a new article
    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    // Get articles by author ID
    public List<Article> getArticlesByAuthor(UUID authorId) {
        return articleRepository.findByAuthorId(authorId);
    }
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }


    // Get articles by category
    public List<Article> getArticlesByCategory(String category) {
        return articleRepository.findByCategory(category);
    }

    // Delete an article by ID
    public void deleteArticle(UUID id) {
        articleRepository.deleteById(id);
    }

    // Get article by ID
    public Optional<Article> getArticleById(UUID articleId) {
        return articleRepository.findById(articleId);
    }
    public List<Article> getArticlesByTitle(String title) {
        return articleRepository.findByTitleContainingIgnoreCase(title);
    }
    public Article updateArticle(UUID id, Article updatedArticle) {
        // Find the existing article by ID
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // Update the fields of the existing article
        existingArticle.setTitle(updatedArticle.getTitle());
        existingArticle.setContent(updatedArticle.getContent());
        existingArticle.setCategory(updatedArticle.getCategory());
        // Update other fields as needed

        // Save the updated article
        return articleRepository.save(existingArticle);
    }
    public List<Article> searchArticlesByKeyword(String keyword) {
        return articleRepository.findByTitleContainingOrContentContainingIgnoreCase(keyword, keyword);
    }
    public Article partialUpdateArticle(UUID id, Map<String, Object> updates) {
        Article existingArticle = articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found with id: " + id));

        // Iterate through the updates and apply them to the existing article
        updates.forEach((key, value) -> {
            switch (key) {
                case "title":
                    existingArticle.setTitle((String) value);
                    break;
                case "content":
                    existingArticle.setContent((String) value);
                    break;
                case "category":
                    existingArticle.setCategory((String) value);
                    break;
                // Add more cases for other fields if needed
                default:
                    // Ignore unknown fields or throw an exception
                    break;
            }
        });

        return articleRepository.save(existingArticle); // Save the updated article
    }

}
