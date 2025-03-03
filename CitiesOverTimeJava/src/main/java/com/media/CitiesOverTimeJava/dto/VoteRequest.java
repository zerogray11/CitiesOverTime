package com.media.CitiesOverTimeJava.dto;

public class VoteRequest {
    private String voteType; // "up", "down", or "none"

    // Getters and setters
    public String getVoteType() {
        return voteType;
    }

    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }
}