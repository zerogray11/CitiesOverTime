package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.Map;
import com.media.CitiesOverTimeJava.repository.MapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MapService {
    @Autowired
    private MapRepository mapRepository;

    public Map createMap(Map map) {
        return mapRepository.save(map);
    }

    public List<Map> getAllMaps() {
        return mapRepository.findAll();
    }

    public Optional<Map> getMapById(UUID id) {
        return mapRepository.findById(id);
    }

    public Map updateMap(UUID id, Map updatedMap) {
        Map existingMap = mapRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Map not found with id: " + id));
        existingMap.setName(updatedMap.getName());
        existingMap.setCities(updatedMap.getCities());
        return mapRepository.save(existingMap);
    }

    public void deleteMap(UUID id) {
        mapRepository.deleteById(id);
    }
    public Map save(Map map) {
        return mapRepository.save(map);
    }
}
