package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.repository.UserRepository;
import com.media.CitiesOverTimeJava.utility.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setUsername("testUser");
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
        testUser.setPassword("encodedPassword");
    }

    @Test
    public void testRegisterUser_Success() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.empty());
        when(userRepository.findByUsername(testUser.getUsername())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(testUser.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User registeredUser = userService.registerUser(testUser);

        // Assert
        assertNotNull(registeredUser);
        assertEquals(testUser.getUsername(), registeredUser.getUsername());
        assertEquals(testUser.getEmail(), registeredUser.getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testGetUserByUsername_Success() {
        // Arrange
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(testUser));

        // Act
        User foundUser = userService.getUserByUsername("testUser");

        // Assert
        assertNotNull(foundUser);
        assertEquals("testUser", foundUser.getUsername());
    }

    @Test
    public void testAuthenticateUser_Success() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("correctPassword", testUser.getPassword())).thenReturn(true);

        // Act
        User authenticatedUser = userService.authenticateUser(testUser.getEmail(), "correctPassword");

        // Assert
        assertNotNull(authenticatedUser);
        assertEquals(testUser.getEmail(), authenticatedUser.getEmail());
    }

    @Test
    public void testAuthenticateUser_InvalidPassword() {
        // Arrange
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPassword", testUser.getPassword())).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.authenticateUser(testUser.getEmail(), "wrongPassword");
        });
        assertEquals("Invalid password", exception.getMessage());
    }

    @Test
    public void testChangePassword_Success() {
        // Arrange
        when(jwtUtil.validateToken("validToken")).thenReturn(true);
        when(jwtUtil.extractUsername("validToken")).thenReturn(testUser.getEmail());
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPassword", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.encode("newPassword")).thenReturn("newEncodedPassword");

        // Act
        userService.changePassword(testUser.getId(), "oldPassword", "newPassword", "validToken");

        // Assert
        verify(userRepository, times(1)).save(testUser);
        assertEquals("newEncodedPassword", testUser.getPassword());
    }

    @Test
    public void testUpdateProfile_Success() {
        // Arrange
        String newFullName = "Updated Name";
        String newUsername = "UpdatedUser";
        String newEmail = "updated@example.com";

        when(jwtUtil.validateToken("validToken")).thenReturn(true);
        when(jwtUtil.extractUsername("validToken")).thenReturn(testUser.getEmail());
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(userRepository.findByUsername(newUsername)).thenReturn(Optional.empty());
        when(userRepository.findByEmail(newEmail)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        User updatedUser = userService.updateProfile(testUser.getId(), newFullName, newUsername, newEmail, "validToken");

        // Assert
        assertNotNull(updatedUser);
        assertEquals(newFullName, updatedUser.getFullName());
        assertEquals(newUsername, updatedUser.getUsername());
        assertEquals(newEmail, updatedUser.getEmail());
    }
}
