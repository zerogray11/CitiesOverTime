package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.City;
import com.media.CitiesOverTimeJava.model.Map;
import com.media.CitiesOverTimeJava.repository.MapRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MapServiceTest {

    @Mock
    private MapRepository mapRepository;

    @InjectMocks
    private MapService mapService;

    @Test
    public void mapService_CreateMap_ReturnsMap() {
        // Arrange
        Map map = new Map();
        map.setName("Test Map");

        City city1 = new City();
        city1.setName("City1");
        City city2 = new City();
        city2.setName("City2");

        map.setCities(List.of(city1, city2)); // Use List<City> instead of List<String>

        when(mapRepository.save(any(Map.class))).thenReturn(map);

        // Act
        Map createdMap = mapService.createMap(map);

        // Assert
        assertNotNull(createdMap);
        assertEquals("Test Map", createdMap.getName());
        assertEquals(2, createdMap.getCities().size());
    }

    @Test
    public void mapService_GetAllMaps_ReturnsMapList() {
        // Arrange
        Map map1 = new Map();
        map1.setName("Map 1");

        Map map2 = new Map();
        map2.setName("Map 2");

        when(mapRepository.findAll()).thenReturn(List.of(map1, map2));

        // Act
        List<Map> maps = mapService.getAllMaps();

        // Assert
        assertNotNull(maps);
        assertEquals(2, maps.size());
    }

    @Test
    public void mapService_GetMapById_ReturnsMap() {
        // Arrange
        UUID mapId = UUID.randomUUID();
        Map map = new Map();
        map.setId(mapId);
        map.setName("Test Map");

        when(mapRepository.findById(mapId)).thenReturn(Optional.of(map));

        // Act
        Optional<Map> foundMap = mapService.getMapById(mapId);

        // Assert
        assertTrue(foundMap.isPresent());
        assertEquals(mapId, foundMap.get().getId());
        assertEquals("Test Map", foundMap.get().getName());
    }

    @Test
    public void mapService_UpdateMap_ReturnsUpdatedMap() {
        // Arrange
        UUID mapId = UUID.randomUUID();
        Map existingMap = new Map();
        existingMap.setId(mapId);
        existingMap.setName("Old Map");

        City oldCity = new City();
        oldCity.setName("Old City");
        existingMap.setCities(List.of(oldCity));

        Map updatedMap = new Map();
        updatedMap.setName("Updated Map");

        City newCity = new City();
        newCity.setName("New City");
        updatedMap.setCities(List.of(newCity));

        when(mapRepository.findById(mapId)).thenReturn(Optional.of(existingMap));
        when(mapRepository.save(any(Map.class))).thenReturn(existingMap);

        // Act
        Map result = mapService.updateMap(mapId, updatedMap);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Map", result.getName());
        assertEquals(1, result.getCities().size());
    }

    @Test
    public void mapService_DeleteMap_DeletesMap() {
        // Arrange
        UUID mapId = UUID.randomUUID();

        doNothing().when(mapRepository).deleteById(mapId);

        // Act
        mapService.deleteMap(mapId);

        // Assert
        verify(mapRepository, times(1)).deleteById(mapId);
    }

    @Test
    public void mapService_SaveMap_ReturnsSavedMap() {
        // Arrange
        Map map = new Map();
        map.setName("Test Map");

        when(mapRepository.save(any(Map.class))).thenReturn(map);

        // Act
        Map savedMap = mapService.save(map);

        // Assert
        assertNotNull(savedMap);
        assertEquals("Test Map", savedMap.getName());
    }
}