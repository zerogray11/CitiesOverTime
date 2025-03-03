package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ExtendWith(SpringExtension.class)
public class MapRepositoryTest {

    @Autowired
    private MapRepository mapRepository;

    @Test
    public void mapRepository_SaveMap_ReturnsSavedMap() {
        // Arrange
        Map map = new Map();
        map.setName("Test Map");

        // Act
        Map savedMap = mapRepository.save(map);

        // Assert
        assertNotNull(savedMap);
        assertNotNull(savedMap.getId());
        assertEquals("Test Map", savedMap.getName());
    }

    @Test
    public void mapRepository_FindById_ReturnsMap() {
        // Arrange
        Map map = new Map();
        map.setName("Test Map");
        Map savedMap = mapRepository.save(map);

        // Act
        Optional<Map> foundMap = mapRepository.findById(savedMap.getId());

        // Assert
        assertTrue(foundMap.isPresent());
        assertEquals(savedMap.getId(), foundMap.get().getId());
        assertEquals("Test Map", foundMap.get().getName());
    }

    @Test
    public void mapRepository_FindAll_ReturnsAllMaps() {
        // Arrange
        Map map1 = new Map();
        map1.setName("Map 1");
        Map map2 = new Map();
        map2.setName("Map 2");

        mapRepository.save(map1);
        mapRepository.save(map2);

        // Act
        List<Map> maps = mapRepository.findAll();

        // Assert
        assertNotNull(maps);
        assertEquals(2, maps.size());
    }

    @Test
    public void mapRepository_DeleteById_DeletesMap() {
        // Arrange
        Map map = new Map();
        map.setName("Test Map");
        Map savedMap = mapRepository.save(map);

        // Act
        mapRepository.deleteById(savedMap.getId());

        // Assert
        Optional<Map> deletedMap = mapRepository.findById(savedMap.getId());
        assertFalse(deletedMap.isPresent());
    }
}