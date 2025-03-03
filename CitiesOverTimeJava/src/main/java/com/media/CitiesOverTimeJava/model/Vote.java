package com.media.CitiesOverTimeJava.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.UUID;

@Entity
@Table(name = "votes")
public class Vote {

    @Id
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id = UUID.randomUUID();

    @Column(name = "target_id", nullable = false)
    private UUID targetId; // ID of the target entity (post, article, or comment)

    @Column(name = "target_type", nullable = false)
    private String targetType; // Type of the target entity: "post", "article", or "comment"

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String voteType; // "upvote" or "downvote"

    @CreationTimestamp
    @Column(updatable = false)
    private Timestamp createdAt;
    public Vote() {
    }

    // Parameterized constructor (optional)
    public Vote(UUID targetId, String targetType, User user, String voteType) {
        this.targetId = targetId;
        this.targetType = targetType;
        this.user = user;
        this.voteType = voteType;
    }


    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getTargetId() {
        return targetId;
    }

    public void setTargetId(UUID targetId) {
        this.targetId = targetId;
    }

    public String getTargetType() {
        return targetType;
    }

    public void setTargetType(String targetType) {
        this.targetType = targetType;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getVoteType() {
        return voteType;
    }

    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}