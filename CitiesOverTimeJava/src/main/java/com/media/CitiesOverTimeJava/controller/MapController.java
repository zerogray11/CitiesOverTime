package com.media.CitiesOverTimeJava.controller;

import com.media.CitiesOverTimeJava.model.Map;
import com.media.CitiesOverTimeJava.repository.MapRepository;
import com.media.CitiesOverTimeJava.service.MapService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/maps")
public class MapController {
    @Autowired
    private MapService mapService;
    @Autowired
    private MapRepository mapRepository;

    @PostMapping
    public ResponseEntity<Map> createMap(@RequestBody Map map) {
        Map createdMap = mapService.createMap(map);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdMap);
    }

    @GetMapping
    public ResponseEntity<List<Map>> getAllMaps() {
        List<Map> maps = mapService.getAllMaps();
        return ResponseEntity.ok(maps);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map> getMapById(@PathVariable UUID id) {
        Optional<Map> map = mapService.getMapById(id);
        return map.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Annotate with @PutMapping and specify the path
    @PutMapping("/{id}")
    public ResponseEntity<Map> updateMap(@PathVariable UUID id, @RequestBody Map updatedMap) {
        Map existingMap = mapRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Map not found"));

        // Ensure cities list is not null before updating
        if (updatedMap.getCities() == null) {
            updatedMap.setCities(new ArrayList<>());
        }

        // Set the updated cities to the existing map
        existingMap.setCities(updatedMap.getCities());

        // Save the updated map, ensuring orphaned cities are properly handled
        Map updated = mapRepository.save(existingMap);
        return ResponseEntity.ok(updated);
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMap(@PathVariable UUID id) {
        mapService.deleteMap(id);
        return ResponseEntity.noContent().build();
    }
}
