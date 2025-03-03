package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByArticleId(UUID articleId);
}