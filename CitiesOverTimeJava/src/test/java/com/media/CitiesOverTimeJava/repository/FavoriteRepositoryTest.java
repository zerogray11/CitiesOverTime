package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Favorite;
import com.media.CitiesOverTimeJava.model.User;
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
public class FavoriteRepositoryTest {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Test
    public void favoriteRepository_FindByUserId_ReturnsFavoriteList() {
        // Arrange
        User user = new User();
        user.setId(UUID.randomUUID());

        Favorite favorite = new Favorite();
        favorite.setUser(user); // Set the User object
        favoriteRepository.save(favorite);

        // Act
        List<Favorite> result = favoriteRepository.findByUserId(user.getId());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(user.getId(), result.get(0).getUser().getId());
    }

    @Test
    public void favoriteRepository_FindByArticleId_ReturnsFavoriteList() {
        // Arrange
        Article article = new Article();
        article.setId(UUID.randomUUID());

        Favorite favorite = new Favorite();
        favorite.setArticle(article); // Set the Article object
        favoriteRepository.save(favorite);

        // Act
        List<Favorite> result = favoriteRepository.findByArticleId(article.getId());

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(article.getId(), result.get(0).getArticle().getId());
    }

    @Test
    public void favoriteRepository_FindByArticleIdAndUserId_ReturnsFavorite() {
        // Arrange
        Article article = new Article();
        article.setId(UUID.randomUUID());

        User user = new User();
        user.setId(UUID.randomUUID());

        Favorite favorite = new Favorite();
        favorite.setArticle(article); // Set the Article object
        favorite.setUser(user); // Set the User object
        favoriteRepository.save(favorite);

        // Act
        Optional<Favorite> result = favoriteRepository.findByArticleIdAndUserId(article.getId(), user.getId());

        // Assert
        assertTrue(result.isPresent());
        assertEquals(article.getId(), result.get().getArticle().getId());
        assertEquals(user.getId(), result.get().getUser().getId());
    }

    @Test
    public void favoriteRepository_ExistsByUserIdAndArticleId_ReturnsTrue() {
        // Arrange
        Article article = new Article();
        article.setId(UUID.randomUUID());

        User user = new User();
        user.setId(UUID.randomUUID());

        Favorite favorite = new Favorite();
        favorite.setArticle(article); // Set the Article object
        favorite.setUser(user); // Set the User object
        favoriteRepository.save(favorite);

        // Act
        boolean result = favoriteRepository.existsByUserIdAndArticleId(user.getId(), article.getId());

        // Assert
        assertTrue(result);
    }

    @Test
    public void favoriteRepository_DeleteByUserIdAndArticleId_DeletesFavorite() {
        // Arrange
        Article article = new Article();
        article.setId(UUID.randomUUID());

        User user = new User();
        user.setId(UUID.randomUUID());

        Favorite favorite = new Favorite();
        favorite.setArticle(article); // Set the Article object
        favorite.setUser(user); // Set the User object
        favoriteRepository.save(favorite);

        // Act
        favoriteRepository.deleteByUserIdAndArticleId(user.getId(), article.getId());

        // Assert
        assertFalse(favoriteRepository.existsByUserIdAndArticleId(user.getId(), article.getId()));
    }
}