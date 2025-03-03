package com.media.CitiesOverTimeJava.dto;

import java.util.UUID;

public class FavoriteRequest {
    private UUID articleId; // Matches frontend payload
     // Matches frontend payload

    // Getters and Setters
    public UUID getArticleId() {
        return articleId;
    }

    public void setArticleId(UUID articleId) {
        this.articleId = articleId;
    }


}