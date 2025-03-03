package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.dto.FavoriteDTO;
import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Favorite;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.FavoriteRepository;
import com.media.CitiesOverTimeJava.repository.ArticleRepository;
import com.media.CitiesOverTimeJava.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserService userService;

    @Mock
    private ArticleService articleService;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    public void favoriteService_AddFavorite_NewFavorite_ReturnsFavorite() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        User user = new User();
        user.setId(userId);

        Article article = new Article();
        article.setId(articleId);

        when(userService.getUserById(userId)).thenReturn(user);
        when(articleService.getArticleById(articleId)).thenReturn(Optional.of(article));
        when(favoriteRepository.findByArticleIdAndUserId(articleId, userId)).thenReturn(Optional.empty());

        Favorite favorite = new Favorite();
        favorite.setArticle(article);
        favorite.setUser(user);

        when(favoriteRepository.save(any(Favorite.class))).thenReturn(favorite);

        // Act
        Favorite result = favoriteService.addFavorite(articleId, userId);

        // Assert
        assertNotNull(result);
        assertEquals(articleId, result.getArticle().getId());
        assertEquals(userId, result.getUser().getId());
    }

    @Test
    public void favoriteService_AddFavorite_ExistingFavorite_ReturnsExistingFavorite() {
        // Arrange
        UUID articleId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();

        User user = new User();
        user.setId(userId);

        Article article = new Article();
        article.setId(articleId);

        Favorite existingFavorite = new Favorite();
        existingFavorite.setArticle(article);
        existingFavorite.setUser(user);

        when(userService.getUserById(userId)).thenReturn(user);
        when(articleService.getArticleById(articleId)).thenReturn(Optional.of(article));
        when(favoriteRepository.findByArticleIdAndUserId(articleId, userId)).thenReturn(Optional.of(existingFavorite));

        // Act
        Favorite result = favoriteService.addFavorite(articleId, userId);

        // Assert
        assertNotNull(result);
        assertEquals(existingFavorite, result);
    }

    @Test
    public void favoriteService_GetFavoriteDTOsByUser_ReturnsFavoriteDTOList() {
        // Arrange
        UUID userId = UUID.randomUUID();

        User user = new User();
        user.setId(userId);

        Article article = new Article();
        article.setId(UUID.randomUUID());
        article.setTitle("Test Article");

        Favorite favorite = new Favorite();
        favorite.setId(UUID.randomUUID());
        favorite.setArticle(article);
        favorite.setUser(user);

        when(favoriteRepository.findByUserId(userId)).thenReturn(List.of(favorite));

        // Act
        List<FavoriteDTO> result = favoriteService.getFavoriteDTOsByUser(userId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(favorite.getId(), result.get(0).getId());
        assertEquals(article.getTitle(), result.get(0).getArticle().getTitle());
    }

    @Test
    public void favoriteService_GetFavoritesByUser_ReturnsFavoriteList() {
        // Arrange
        UUID userId = UUID.randomUUID();

        Favorite favorite = new Favorite();
        favorite.setId(UUID.randomUUID());

        when(favoriteRepository.findByUserId(userId)).thenReturn(List.of(favorite));

        // Act
        List<Favorite> result = favoriteService.getFavoritesByUser(userId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(favorite.getId(), result.get(0).getId());
    }

    @Test
    public void favoriteService_GetFavoritesByArticle_ReturnsFavoriteList() {
        // Arrange
        UUID articleId = UUID.randomUUID();

        Favorite favorite = new Favorite();
        favorite.setId(UUID.randomUUID());

        when(favoriteRepository.findByArticleId(articleId)).thenReturn(List.of(favorite));

        // Act
        List<Favorite> result = favoriteService.getFavoritesByArticle(articleId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(favorite.getId(), result.get(0).getId());
    }

    @Test
    public void favoriteService_IsArticleFavoritedByUser_ReturnsTrue() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID articleId = UUID.randomUUID();

        when(favoriteRepository.existsByUserIdAndArticleId(userId, articleId)).thenReturn(true);

        // Act
        boolean result = favoriteService.isArticleFavoritedByUser(userId, articleId);

        // Assert
        assertTrue(result);
    }

    @Test
    public void favoriteService_RemoveFavorite_DeletesFavorite() {
        // Arrange
        UUID userId = UUID.randomUUID();
        UUID articleId = UUID.randomUUID();

        when(favoriteRepository.existsByUserIdAndArticleId(userId, articleId)).thenReturn(true);
        doNothing().when(favoriteRepository).deleteByUserIdAndArticleId(userId, articleId);

        // Act
        favoriteService.removeFavorite(userId, articleId);

        // Assert
        verify(favoriteRepository, times(1)).deleteByUserIdAndArticleId(userId, articleId);
    }
}