package com.citiesovertime.citiesovertime11.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    /**
     * Basic health check endpoint
     * @return API status with timestamp
     */
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "CitiesOverTime Backend is running");
        response.put("timestamp", Instant.now().toString());
        response.put("documentation", "https://your-api-docs-url.com");
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint for monitoring
     * @return Basic health status
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }

    /**
     * Simple ping endpoint
     * @return Pong response
     */
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
