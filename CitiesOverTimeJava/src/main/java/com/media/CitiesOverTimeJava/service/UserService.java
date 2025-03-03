package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.UserRepository;
import com.media.CitiesOverTimeJava.utility.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // Inject JwtUtil for token validation

    // Register a new user
    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists: " + user.getUsername());
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user to the database
        return userRepository.save(user);
    }
    public User getUserByFullName(String fullName) {
        return userRepository.findByFullName(fullName)
                .orElseThrow(() -> new RuntimeException("User not found with fullName: " + fullName));
    }

    // Authenticate user
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Ensure the role is fetched
        if (user.getRole() == null) {
            user.setRole("ROLE_USER"); // Default role if null
        }

        return user;
    }


    // Fetch user by username
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    // Fetch user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    // Fetch user by ID
    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }

    // Change password
    public void changePassword(UUID userId, String currentPassword, String newPassword, String token) {
        // Validate the token
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        // Extract the email from the token
        String email = jwtUtil.extractUsername(token);

        // Fetch the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the user is updating their own password
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only update your own password");
        }

        // Verify the current password
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update the password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Update profile
    public User updateProfile(UUID userId, String fullName, String username, String email, String token) {
        // Validate the token
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        // Extract the email from the token
        String tokenEmail = jwtUtil.extractUsername(token);

        // Fetch the user by email
        User user = userRepository.findByEmail(tokenEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the user is updating their own profile
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You can only update your own profile");
        }

        // Check if the new username or email already exists
        if (!username.equals(user.getUsername()) && userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists: " + username);
        }

        if (!email.equals(user.getEmail()) && userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists: " + email);
        }

        // Update the user's profile information
        user.setFullName(fullName);
        user.setUsername(username);
        user.setEmail(email);

        // Save the updated user
        return userRepository.save(user);
    }
}