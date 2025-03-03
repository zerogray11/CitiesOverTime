package com.media.CitiesOverTimeJava.controller;

import com.media.CitiesOverTimeJava.model.User;

import com.media.CitiesOverTimeJava.security.CustomUserDetails;
import com.media.CitiesOverTimeJava.service.UserService;
import com.media.CitiesOverTimeJava.utility.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "https://localhost:5173", allowCredentials = "true")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok(Map.of(
                    "message", "User registered successfully",
                    "user", registeredUser
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    // Change password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request,
                                            @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract the token from the Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(403).body("Invalid or missing token");
            }

            String token = authHeader.replace("Bearer ", "");

            // Get the authenticated user's email from the SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(403).body("User not authenticated");
            }

            String email = authentication.getName(); // Use email as the username
            User authenticatedUser = userService.getUserByEmail(email);
            if (authenticatedUser == null) {
                return ResponseEntity.status(403).body("User not found");
            }

            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            // Change the password
            userService.changePassword(authenticatedUser.getId(), currentPassword, newPassword, token);

            return ResponseEntity.ok(Map.of(
                    "message", "Password changed successfully"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    // Handle login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            // Authenticate the user
            User user = userService.authenticateUser(email, password);

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail());

            // Return the token, user details, and role
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "user", Map.of(
                            "id", user.getId(), // Include the user ID
                            "email", user.getEmail(),
                            "username", user.getUsername(), // Include the username
                            "fullName", user.getFullName(), // Include the full name
                            "role", user.getRole().replace("ROLE_", "")  // Ensure the role is included
                    ),
                    "token", token
            ));
        } catch (RuntimeException e) {
            // Handle invalid credentials or other errors
            return ResponseEntity.status(401).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    // Get user by ID
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable UUID userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null) {
                logger.error("User is not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User is not authenticated");
            }

            // Extract User from CustomUserDetails
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            logger.info("Fetched user data for user: {}", user.getEmail());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            logger.error("Error fetching current user:", e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        try {
            User user = userService.getUserByUsername(username);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            User user = userService.getUserByEmail(email);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user by fullName
    @GetMapping("/fullname/{fullName}")
    public ResponseEntity<?> getUserByFullName(@PathVariable String fullName) {
        try {
            User user = userService.getUserByFullName(fullName);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract the token from the Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(403).body("Invalid or missing token");
            }

            String token = authHeader.replace("Bearer ", "");

            // Validate the token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(403).body("Invalid or expired token");
            }

            // Extract the email from the token
            String email = jwtUtil.extractUsername(token);

            // Fetch the user by email
            User user = userService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(403).body("User not found");
            }

            // Invalidate the token (optional, if using a token blacklist)
            // For example, you can add the token to a blacklist in Redis or a database.

            return ResponseEntity.ok(Map.of(
                    "message", "Logout successful"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request,
                                           @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract the token from the Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(403).body("Invalid or missing token");
            }

            String token = authHeader.replace("Bearer ", "");

            // Get the authenticated user from the SecurityContext
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(403).body("User not authenticated");
            }

            // Fetch the user by email explicitly
            String email = authentication.getName(); // Ensure this is the email
            User authenticatedUser = userService.getUserByEmail(email);
            if (authenticatedUser == null) {
                return ResponseEntity.status(403).body("User not found with email: " + email);
            }

            String fullName = request.get("fullName");
            String username = request.get("username");
            String newEmail = request.get("email");

            // Update the user's profile information
            User updatedUser = userService.updateProfile(authenticatedUser.getId(), fullName, username, newEmail, token);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "user", updatedUser
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }
}