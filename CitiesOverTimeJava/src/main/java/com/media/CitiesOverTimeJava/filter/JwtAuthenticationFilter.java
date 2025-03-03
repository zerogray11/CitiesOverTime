package com.media.CitiesOverTimeJava.filter;

import com.media.CitiesOverTimeJava.model.User;
import com.media.CitiesOverTimeJava.security.CustomUserDetails;
import com.media.CitiesOverTimeJava.service.UserService;
import com.media.CitiesOverTimeJava.utility.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, UserService userService) {
        this.jwtUtil = jwtUtil;
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Extract the Authorization header
        String authHeader = request.getHeader("Authorization");

        // Check if the header is valid
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.replace("Bearer ", "");

            // Validate the token
            if (jwtUtil.validateToken(token)) {
                // Extract the email (username) from the token
                String email = jwtUtil.extractUsername(token);

                // Check if the user is not already authenticated
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Load the user from the database using UserService
                    User user = userService.getUserByEmail(email);

                    if (user != null) {
                        // Create a CustomUserDetails object from the User entity
                        CustomUserDetails userDetails = new CustomUserDetails(user);

                        // Create an authentication object with the CustomUserDetails
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Set the authentication in the SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        // Log the authentication
                        logger.info("Authentication set for user: " + authentication.getName());
                    }
                }
            }
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}