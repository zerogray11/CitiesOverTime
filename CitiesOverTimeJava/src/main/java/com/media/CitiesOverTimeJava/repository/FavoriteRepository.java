package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    List<Favorite> findByUserId(UUID userId);
    List<Favorite> findByArticleId(UUID articleId);
    Optional<Favorite> findByArticleIdAndUserId(UUID articleId, UUID userId);
    boolean existsByUserIdAndArticleId(UUID userId, UUID articleId);

    @Transactional
    void deleteByUserIdAndArticleId(UUID userId, UUID articleId); // Ensure this method exists
}