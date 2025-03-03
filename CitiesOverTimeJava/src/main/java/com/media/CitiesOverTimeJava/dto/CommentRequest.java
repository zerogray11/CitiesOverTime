package com.media.CitiesOverTimeJava.dto;

public class CommentRequest {
    private String content; // Only the content is required in the request body

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}