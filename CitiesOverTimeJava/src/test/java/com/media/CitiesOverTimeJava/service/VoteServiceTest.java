package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.model.Vote;
import com.media.CitiesOverTimeJava.repository.VoteRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class VoteServiceTest {

    @Mock
    private VoteRepository voteRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private VoteService voteService;

    @Test
    public void voteService_AddOrUpdateVote_NewVote_ReturnsVote() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        UUID userId = UUID.randomUUID();
        String voteType = "upvote";

        User user = new User();
        user.setId(userId);

        when(userService.getUserById(userId)).thenReturn(user);
        when(voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId)).thenReturn(Optional.empty());

        Vote newVote = new Vote(targetId, targetType, user, voteType);
        when(voteRepository.save(any(Vote.class))).thenReturn(newVote);

        // Act
        Vote result = voteService.addOrUpdateVote(targetId, targetType, userId, voteType);

        // Assert
        assertNotNull(result);
        assertEquals(targetId, result.getTargetId());
        assertEquals(targetType, result.getTargetType());
        assertEquals(userId, result.getUser().getId());
        assertEquals(voteType, result.getVoteType());
    }

    @Test
    public void voteService_AddOrUpdateVote_UpdateVote_ReturnsUpdatedVote() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        UUID userId = UUID.randomUUID();
        String voteType = "downvote";

        User user = new User();
        user.setId(userId);

        Vote existingVote = new Vote(targetId, targetType, user, "upvote");

        when(userService.getUserById(userId)).thenReturn(user);
        when(voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId)).thenReturn(Optional.of(existingVote));
        when(voteRepository.save(any(Vote.class))).thenReturn(existingVote);

        // Act
        Vote result = voteService.addOrUpdateVote(targetId, targetType, userId, voteType);

        // Assert
        assertNotNull(result);
        assertEquals(voteType, result.getVoteType());
    }

    @Test
    public void voteService_AddOrUpdateVote_RemoveVote_ReturnsNull() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        UUID userId = UUID.randomUUID();
        String voteType = "none";

        User user = new User();
        user.setId(userId);

        Vote existingVote = new Vote(targetId, targetType, user, "upvote");

        when(userService.getUserById(userId)).thenReturn(user);
        when(voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId)).thenReturn(Optional.of(existingVote));

        // Act
        Vote result = voteService.addOrUpdateVote(targetId, targetType, userId, voteType);

        // Assert
        assertNull(result);
        verify(voteRepository, times(1)).delete(existingVote);
    }

    @Test
    public void voteService_GetVoteById_ReturnsVote() {
        // Arrange
        UUID voteId = UUID.randomUUID();
        Vote vote = new Vote();
        vote.setId(voteId);

        when(voteRepository.findById(voteId)).thenReturn(Optional.of(vote));

        // Act
        Vote result = voteService.getVoteById(voteId);

        // Assert
        assertNotNull(result);
        assertEquals(voteId, result.getId());
    }

    @Test
    public void voteService_GetUpvoteCount_ReturnsCount() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        long expectedCount = 5;

        when(voteRepository.countByTargetIdAndTargetTypeAndVoteType(targetId, targetType, "upvote")).thenReturn(expectedCount);

        // Act
        long result = voteService.getUpvoteCount(targetId, targetType);

        // Assert
        assertEquals(expectedCount, result);
    }

    @Test
    public void voteService_GetDownvoteCount_ReturnsCount() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        long expectedCount = 3;

        when(voteRepository.countByTargetIdAndTargetTypeAndVoteType(targetId, targetType, "downvote")).thenReturn(expectedCount);

        // Act
        long result = voteService.getDownvoteCount(targetId, targetType);

        // Assert
        assertEquals(expectedCount, result);
    }

    @Test
    public void voteService_GetUserVote_ReturnsVoteType() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        UUID userId = UUID.randomUUID();
        String voteType = "upvote";

        Vote vote = new Vote();
        vote.setVoteType(voteType);

        when(voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, userId)).thenReturn(Optional.of(vote));

        // Act
        String result = voteService.getUserVote(targetId, targetType, userId);

        // Assert
        assertEquals(voteType, result);
    }

    @Test
    public void voteService_DeleteVote_DeletesVote() {
        // Arrange
        UUID voteId = UUID.randomUUID();

        doNothing().when(voteRepository).deleteById(voteId);

        // Act
        voteService.deleteVote(voteId);

        // Assert
        verify(voteRepository, times(1)).deleteById(voteId);
    }
}