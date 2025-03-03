package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.model.Vote;
import com.media.CitiesOverTimeJava.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class VoteService {

    @Autowired
    private VoteRepository voteRepository;

    @Autowired
    private UserService userService; // To fetch the user

    // Add or update a vote
    public Vote addOrUpdateVote(UUID targetId, String targetType, UUID userId, String voteType) {
        // Fetch the User entity using the userId
        User user = userService.getUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        if (voteType.equals("none")) {
            // Remove the vote if it exists
            Optional<Vote> existingVote = voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId);
            if (existingVote.isPresent()) {
                voteRepository.delete(existingVote.get());
                return null; // Indicate that the vote was removed
            } else {
                return null; // No vote found to remove
            }
        } else {
            // Map frontend values to database values
            String dbVoteType = voteType.equals("upvote") ? "upvote" : "downvote";

            // Check if the user already voted
            Optional<Vote> existingVote = voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId);

            if (existingVote.isPresent()) {
                // Update existing vote
                Vote vote = existingVote.get();
                vote.setVoteType(dbVoteType);
                return voteRepository.save(vote);
            } else {
                // Create new vote
                Vote vote = new Vote(targetId, targetType, user, dbVoteType); // Pass the User object
                return voteRepository.save(vote);
            }
        }
    }
    public Vote getVoteById(UUID voteId) {
        return voteRepository.findById(voteId)
                .orElseThrow(() -> new RuntimeException("Vote not found with id: " + voteId));
    }
    // Get upvote count for a target
    public long getUpvoteCount(UUID targetId, String targetType) {
        return voteRepository.countByTargetIdAndTargetTypeAndVoteType(targetId, targetType, "upvote");
    }

    // Get downvote count for a target
    public long getDownvoteCount(UUID targetId, String targetType) {
        return voteRepository.countByTargetIdAndTargetTypeAndVoteType(targetId, targetType, "downvote");
    }

    // Get the user's vote for a specific target
    public String getUserVote(UUID targetId, String targetType, UUID userId) {
        Optional<Vote> vote = voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId);
        return vote.map(Vote::getVoteType).orElse(null);
    }

    // Delete a vote
    public void deleteVote(UUID voteId) {
        voteRepository.deleteById(voteId);
    }
}