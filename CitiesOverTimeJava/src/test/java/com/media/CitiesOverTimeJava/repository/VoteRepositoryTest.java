package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.model.Vote;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class VoteRepositoryTest {

    @Autowired
    private VoteRepository voteRepository;

    @Test
    public void voteRepository_FindByTargetIdAndTargetTypeAndUserId_ReturnsVote() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        User user = new User();
        user.setId(UUID.randomUUID());

        Vote vote = new Vote();
        vote.setTargetId(targetId);
        vote.setTargetType(targetType);
        vote.setUser(user); // Set the User object

        voteRepository.save(vote);

        // Act
        Optional<Vote> foundVote = voteRepository.findByTargetIdAndTargetTypeAndUserId(targetId, targetType, user.getId());

        // Assert
        assertTrue(foundVote.isPresent());
        assertEquals(targetId, foundVote.get().getTargetId());
        assertEquals(targetType, foundVote.get().getTargetType());
        assertEquals(user.getId(), foundVote.get().getUser().getId());
    }

    @Test
    public void voteRepository_CountByTargetIdAndTargetTypeAndVoteType_ReturnsCount() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";
        String voteType = "upvote";

        Vote vote1 = new Vote();
        vote1.setTargetId(targetId);
        vote1.setTargetType(targetType);
        vote1.setVoteType(voteType);

        Vote vote2 = new Vote();
        vote2.setTargetId(targetId);
        vote2.setTargetType(targetType);
        vote2.setVoteType(voteType);

        voteRepository.save(vote1);
        voteRepository.save(vote2);

        // Act
        long count = voteRepository.countByTargetIdAndTargetTypeAndVoteType(targetId, targetType, voteType);

        // Assert
        assertEquals(2, count);
    }

    @Test
    public void voteRepository_FindByUserId_ReturnsVoteList() {
        // Arrange
        User user = new User();
        user.setId(UUID.randomUUID());

        Vote vote1 = new Vote();
        vote1.setUser(user); // Set the User object

        Vote vote2 = new Vote();
        vote2.setUser(user); // Set the User object

        voteRepository.save(vote1);
        voteRepository.save(vote2);

        // Act
        List<Vote> votes = voteRepository.findByUserId(user.getId());

        // Assert
        assertNotNull(votes);
        assertEquals(2, votes.size());
    }

    @Test
    public void voteRepository_FindByTargetIdAndTargetType_ReturnsVoteList() {
        // Arrange
        UUID targetId = UUID.randomUUID();
        String targetType = "post";

        Vote vote1 = new Vote();
        vote1.setTargetId(targetId);
        vote1.setTargetType(targetType);

        Vote vote2 = new Vote();
        vote2.setTargetId(targetId);
        vote2.setTargetType(targetType);

        voteRepository.save(vote1);
        voteRepository.save(vote2);

        // Act
        List<Vote> votes = voteRepository.findByTargetIdAndTargetType(targetId, targetType);

        // Assert
        assertNotNull(votes);
        assertEquals(2, votes.size());
    }
}