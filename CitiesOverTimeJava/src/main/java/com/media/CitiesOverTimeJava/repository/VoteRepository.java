package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoteRepository extends JpaRepository<Vote, UUID> {
    // Find a vote by target ID, target type, and user ID
    Optional<Vote> findByTargetIdAndTargetTypeAndUserId(UUID targetId, String targetType, UUID userId);

    // Count votes for a target by type (upvote or downvote)
    long countByTargetIdAndTargetTypeAndVoteType(UUID targetId, String targetType, String voteType);

    // Find all votes by user ID
    List<Vote> findByUserId(UUID userId);

    // Find all votes by target ID and target type
    List<Vote> findByTargetIdAndTargetType(UUID targetId, String targetType);
}