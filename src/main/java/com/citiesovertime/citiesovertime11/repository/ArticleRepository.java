package com.citiesovertime.citiesovertime11.repository;

import com.citiesovertime.citiesovertime11.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ArticleRepository extends JpaRepository<Article, UUID> {
    List<Article> findByAuthorId(UUID authorId);
    List<Article> findByCategory(String category);
    List<Article> findByTitleContainingIgnoreCase(String title);
    List<Article> findByContentContainingIgnoreCase(String content);
    List<Article> findByTitleContainingOrContentContainingIgnoreCase(String title, String content);
    List<Article> findAll();


}