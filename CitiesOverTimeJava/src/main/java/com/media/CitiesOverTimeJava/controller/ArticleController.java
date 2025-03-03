package com.media.CitiesOverTimeJava.controller;

import com.media.CitiesOverTimeJava.dto.*;
import com.media.CitiesOverTimeJava.model.*;
import com.media.CitiesOverTimeJava.repository.VoteRepository;
import com.media.CitiesOverTimeJava.security.CustomUserDetails;
import com.media.CitiesOverTimeJava.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private static final Logger logger = LoggerFactory.getLogger(ArticleController.class);
    @Autowired
    private ArticleService articleService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private VoteService voteService;
    @Autowired
    FavoriteService favoriteService;
    @Autowired
    VoteRepository voteRepository;
    @Autowired
    UserService userService;


    // Create a new article
    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody Article article, Authentication authentication) {
        if (article == null || article.getTitle() == null || article.getContent() == null) {
            return ResponseEntity.badRequest().build(); // Bad request if required fields are missing
        }

        // Get the authenticated user
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User author = customUserDetails.getUser(); // Extract User object from CustomUserDetails

        // Set the author
        article.setAuthor(author);

        Article createdArticle = articleService.createArticle(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdArticle);  // Return 201 Created
    }
    // ==== Comments ====
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable UUID id, @RequestBody CommentRequest commentRequest, Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser(); // Extract User object from CustomUserDetails

        Comment comment = commentService.createComment(id, user.getId(), commentRequest.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getCommentsByArticleId(@PathVariable UUID id) {
        List<Comment> comments = commentService.getCommentsByArticleId(id);
        return ResponseEntity.ok(comments);
    }

    // ==== Votes ====
    @PostMapping("/{id}/vote")
    public ResponseEntity<Vote> addOrUpdateVote(@PathVariable UUID id, @RequestBody VoteRequest voteRequest, Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser(); // Extract User object from CustomUserDetails

        Vote vote = voteService.addOrUpdateVote(id, "article", user.getId(), voteRequest.getVoteType());
        return ResponseEntity.status(HttpStatus.CREATED).body(vote);
    }
    @GetMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> getVotesByArticleId(@PathVariable UUID id, Authentication authentication) {
        long upvotes = voteService.getUpvoteCount(id, "article");
        long downvotes = voteService.getDownvoteCount(id, "article");

        // Determine the user's vote if they are authenticated.
        String userVote = null;
        if (authentication != null) {
            CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = customUserDetails.getUser(); // Extract User object from CustomUserDetails

            // Assumes voteService.getUserVote returns "up", "down", or null based on the user's vote.
            userVote = voteService.getUserVote(id, "article", user.getId());
        }

        VoteResponse voteResponse = new VoteResponse(upvotes, downvotes, userVote);
        return ResponseEntity.ok(voteResponse);
    }



    // ==== Favorites ====
    @PostMapping("/{id}/favorites")
    public ResponseEntity<Favorite> addFavorite(@PathVariable UUID id, @RequestBody FavoriteRequest favoriteRequest, Authentication authentication) {
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = customUserDetails.getUser(); // Extract User object from CustomUserDetails

        Favorite favorite = favoriteService.addFavorite(
                favoriteRequest.getArticleId(), // Use articleId from FavoriteRequest
                user.getId()                    // Use userId from the authenticated user
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(favorite);
    }

    @GetMapping("/{id}/favorites")
    public ResponseEntity<Boolean> isArticleFavoritedByUser(
            @PathVariable UUID id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract User from CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        boolean isFavorited = favoriteService.isArticleFavoritedByUser(id, user.getId());
        return ResponseEntity.ok(isFavorited);
    }
    @DeleteMapping("/{id}/favorites")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable UUID id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Extract User from CustomUserDetails
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        favoriteService.removeFavorite(id, user.getId());
        return ResponseEntity.noContent().build();
    }

    // Get articles by author ID
    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<Article>> getArticlesByAuthor(@PathVariable UUID authorId) {
        List<Article> articles = articleService.getArticlesByAuthor(authorId);
        if (articles.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no articles are found
        }
        return ResponseEntity.ok(articles);  // Return 200 OK
    }


    // Get articles by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Article>> getArticlesByCategory(@PathVariable String category) {
        List<Article> articles = articleService.getArticlesByCategory(category);
        if (articles.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no articles are found
        }
        return ResponseEntity.ok(articles);  // Return 200 OK
    }

    @GetMapping("/search")
    public ResponseEntity<List<Article>> searchArticlesByKeyword(@RequestParam String keyword) {
        List<Article> articles = articleService.searchArticlesByKeyword(keyword);
        if (articles.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no articles are found
        }
        return ResponseEntity.ok(articles);  // Return 200 OK
    }

    // Delete an article by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable UUID id) {
        Optional<Article> article = articleService.getArticleById(id);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if the article is not found
        }
        articleService.deleteArticle(id); // Call the delete method
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }

    // Get article by ID
    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable UUID id) {
        Optional<Article> article = articleService.getArticleById(id);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if the article is not found
        }
        return ResponseEntity.ok(article.get()); // Return 200 OK with the article
    }

    @GetMapping("/title/{title}")
    public List<Article> getArticlesByTitle(@PathVariable String title) {
        return articleService.getArticlesByTitle(title);
    }

    // Update an article by ID
    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable UUID id, @RequestBody Article updatedArticle) {
        if (updatedArticle == null || updatedArticle.getTitle() == null || updatedArticle.getContent() == null) {
            return ResponseEntity.badRequest().build(); // Bad request if required fields are missing
        }

        Optional<Article> existingArticle = articleService.getArticleById(id);
        if (existingArticle.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if the article is not found
        }

        Article savedArticle = articleService.updateArticle(id, updatedArticle);
        return ResponseEntity.ok(savedArticle); // Return 200 OK with the updated article
    }

    // Partially update an article by ID
    @PatchMapping("/{id}")
    public ResponseEntity<Article> partialUpdateArticle(@PathVariable UUID id, @RequestBody Map<String, Object> updates) {
        try {
            Article updatedArticle = articleService.partialUpdateArticle(id, updates);
            return ResponseEntity.ok(updatedArticle); // Return 200 OK with the updated article
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Return 404 if the article is not found
        }
    }

    @GetMapping
    public ResponseEntity<List<Article>> getAllArticles() {
        List<Article> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles); // Return all articles
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ArticleDetails> getArticleDetails(@PathVariable UUID id, @RequestParam UUID userId) {
        Optional<Article> article = articleService.getArticleById(id);
        if (article.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if the article is not found
        }

        // Fetch vote counts
        long upvotes = voteService.getUpvoteCount(id, "article");
        long downvotes = voteService.getDownvoteCount(id, "article");

        // Fetch comments
        List<Comment> comments = commentService.getCommentsByArticleId(id);

        // Check if the article is favorited by the user
        boolean isFavorited = favoriteService.isArticleFavoritedByUser(id, userId);

        // Create the ArticleDetails object
        ArticleDetails articleDetails = new ArticleDetails(article.get(), upvotes, downvotes, comments, isFavorited);

        return ResponseEntity.ok(articleDetails); // Return 200 OK with the article details
    }
}