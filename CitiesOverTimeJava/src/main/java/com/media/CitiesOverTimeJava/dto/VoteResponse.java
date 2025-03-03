package com.media.CitiesOverTimeJava.dto;

public class VoteResponse {
    private long upvotes;
    private long downvotes;
    private String userVote; // 'up', 'down', or null

    // Constructor
    public VoteResponse(long upvotes, long downvotes, String userVote) {
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.userVote = userVote;
    }

    // Getters and Setters
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

    public String getUserVote() {
        return userVote;
    }

    public void setUserVote(String userVote) {
        this.userVote = userVote;
    }
}