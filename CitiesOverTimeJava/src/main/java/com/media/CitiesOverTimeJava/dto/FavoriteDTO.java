package com.media.CitiesOverTimeJava.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.UUID;

@Data
public class FavoriteDTO {
    private UUID id;
    private ArticleDTO article; // Use ArticleDTO to avoid circular references
    private Timestamp createdAt;

    public UUID getId() {
        return id;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public ArticleDTO getArticle() {
        return article;
    }

    public void setArticle(ArticleDTO article) {
        this.article = article;
    }

    public void setId(UUID id) {
        this.id = id;
    }
}