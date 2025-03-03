package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.dto.ArticleDTO;
import com.media.CitiesOverTimeJava.dto.FavoriteDTO;
import com.media.CitiesOverTimeJava.model.Article;
import com.media.CitiesOverTimeJava.model.Favorite;
import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.FavoriteRepository;
import com.media.CitiesOverTimeJava.repository.ArticleRepository;
import com.media.CitiesOverTimeJava.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    private static final Logger logger = LoggerFactory.getLogger(FavoriteService.class);
    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    private ArticleService articleService;

    public Favorite addFavorite(UUID articleId, UUID userId) {
        try {
            // Validate input
            if (articleId == null || userId == null) {
                throw new IllegalArgumentException("Invalid input parameters");
            }

            // Fetch the User entity
            User user = userService.getUserById(userId);
            if (user == null) {
                throw new RuntimeException("User not found with id: " + userId);
            }

            // Fetch the Article entity
            Article article = articleService.getArticleById(articleId)
                    .orElseThrow(() -> new RuntimeException("Article not found with id: " + articleId));

            // Check if the favorite already exists
            Optional<Favorite> existingFavorite = favoriteRepository.findByArticleIdAndUserId(articleId, userId);

            if (existingFavorite.isPresent()) {
                // Return the existing favorite instead of throwing an exception
                return existingFavorite.get();
            }

            // Create a new favorite
            Favorite favorite = new Favorite();
            favorite.setArticle(article);
            favorite.setUser(user);
            return favoriteRepository.save(favorite);
        } catch (Exception e) {
            logger.error("Error in addFavorite: " + e.getMessage(), e);
            throw new RuntimeException("Failed to add favorite: " + e.getMessage());
        }
    }
    public List<FavoriteDTO> getFavoriteDTOsByUser(UUID userId) {
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        return favorites.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FavoriteDTO convertToDTO(Favorite favorite) {
        FavoriteDTO dto = new FavoriteDTO();
        dto.setId(favorite.getId());
        dto.setArticle(convertToDTO(favorite.getArticle()));
        dto.setCreatedAt(favorite.getCreatedAt());
        return dto;
    }

    private ArticleDTO convertToDTO(Article article) {
        ArticleDTO dto = new ArticleDTO();
        dto.setId(article.getId());
        dto.setTitle(article.getTitle());
        dto.setContent(article.getContent());
        dto.setCategory(article.getCategory());
        dto.setCreatedAt(article.getCreatedAt());
        return dto;
    }


    public List<Favorite> getFavoritesByUser(UUID userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public List<Favorite> getFavoritesByArticle(UUID articleId) {
        return favoriteRepository.findByArticleId(articleId);
    }

    public boolean isArticleFavoritedByUser(UUID userId, UUID articleId) {
        return favoriteRepository.existsByUserIdAndArticleId(userId, articleId);
    }

    @Transactional
    public void removeFavorite(UUID userId, UUID articleId) {
        if (!favoriteRepository.existsByUserIdAndArticleId(userId, articleId)) {
            throw new RuntimeException("Favorite not found");
        }
        favoriteRepository.deleteByUserIdAndArticleId(userId, articleId);
    }
}