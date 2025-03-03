package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username); // Find user by username
    Optional<User> findByEmail(String email); // Find user by email
    Optional<User> findByFullName(String fullName); // Find user by full name
}