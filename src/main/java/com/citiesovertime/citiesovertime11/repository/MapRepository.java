package com.citiesovertime.citiesovertime11.repository;

import com.citiesovertime.citiesovertime11.model.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MapRepository extends JpaRepository<Map, UUID> {
}