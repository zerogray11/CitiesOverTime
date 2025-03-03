package com.media.CitiesOverTimeJava.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MapApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String fetchMapData(String location) {
        String url = "https://api.map-provider.com/maps?location=" + location;
        return restTemplate.getForObject(url, String.class);
    }
}