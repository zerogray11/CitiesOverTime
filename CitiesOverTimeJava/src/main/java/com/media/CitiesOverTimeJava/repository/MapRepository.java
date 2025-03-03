package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Map;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface MapRepository extends JpaRepository<Map, UUID> {
}