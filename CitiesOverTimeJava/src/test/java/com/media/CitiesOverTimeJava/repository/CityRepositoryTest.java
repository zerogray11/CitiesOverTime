package com.media.CitiesOverTimeJava.repository;

import com.media.CitiesOverTimeJava.model.City;
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
public class CityRepositoryTest {

    @Autowired
    private CityRepository cityRepository;

    @Test
    public void cityRepository_FindByNameContainingIgnoreCase_ReturnsCityList() {
        // Arrange
        City city1 = new City();
        city1.setName("New York");
        cityRepository.save(city1);

        City city2 = new City();
        city2.setName("Los Angeles");
        cityRepository.save(city2);

        // Act
        List<City> cities = cityRepository.findByNameContainingIgnoreCase("new");

        // Assert
        assertNotNull(cities);
        assertEquals(1, cities.size());
        assertEquals("New York", cities.get(0).getName());
    }

    @Test
    public void cityRepository_SaveCity_ReturnsSavedCity() {
        // Arrange
        City city = new City();
        city.setName("Chicago");

        // Act
        City savedCity = cityRepository.save(city);

        // Assert
        assertNotNull(savedCity);
        assertNotNull(savedCity.getId());
        assertEquals("Chicago", savedCity.getName());
    }

    @Test
    public void cityRepository_FindById_ReturnsCity() {
        // Arrange
        City city = new City();
        city.setName("San Francisco");
        City savedCity = cityRepository.save(city);

        // Act
        Optional<City> foundCity = cityRepository.findById(savedCity.getId());

        // Assert
        assertTrue(foundCity.isPresent());
        assertEquals("San Francisco", foundCity.get().getName());
    }

    @Test
    public void cityRepository_DeleteById_DeletesCity() {
        // Arrange
        City city = new City();
        city.setName("Seattle");
        City savedCity = cityRepository.save(city);

        // Act
        cityRepository.deleteById(savedCity.getId());

        // Assert
        Optional<City> deletedCity = cityRepository.findById(savedCity.getId());
        assertFalse(deletedCity.isPresent());
    }
}