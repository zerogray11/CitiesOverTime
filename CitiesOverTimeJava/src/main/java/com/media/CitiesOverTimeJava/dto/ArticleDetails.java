package com.media.CitiesOverTimeJava.dto;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Comment;

import java.util.List;

public class ArticleDetails {
    private Article article;
    private long upvotes;
    private long downvotes;
    private List<Comment> comments;
    private boolean isFavorited;

    // Constructor
    public ArticleDetails(Article article, long upvotes, long downvotes, List<Comment> comments, boolean isFavorited) {
        this.article = article;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.comments = comments;
        this.isFavorited = isFavorited;
    }

    // Getters and Setters
    public Article getArticle() {
        return article;
    }

    public void setArticle(Article article) {
        this.article = article;
    }

    public long getUpvotes() {
        return upvotes;
    }

    public void setUpvotes(long upvotes) {
        this.upvotes = upvotes;
    }

    public long getDownvotes() {
        return downvotes;
    }

    public void setDownvotes(long downvotes) {
        this.downvotes = downvotes;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public boolean isFavorited() {
        return isFavorited;
    }

    public void setFavorited(boolean favorited) {
        isFavorited = favorited;
    }
}