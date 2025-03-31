package com.citiesovertime.citiesovertime11.repository;

import com.citiesovertime.citiesovertime11.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByArticleId(UUID articleId);
}