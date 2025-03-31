package com.citiesovertime.citiesovertime11.repository;

import com.citiesovertime.citiesovertime11.model.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CityRepository extends JpaRepository<City, UUID> {
    List<City> findByNameContainingIgnoreCase(String name);
}