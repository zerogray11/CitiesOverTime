package com.media.CitiesOverTimeJava.exception; // Adjust the package name as needed

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}