package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.City;
import com.media.CitiesOverTimeJava.repository.CityRepository;
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
public class CityServiceTest {

    @Mock
    private CityRepository cityRepository;

    @InjectMocks
    private CityService cityService;

    @Test
    public void cityService_CreateCity_ReturnsCity() {
        // Arrange
        City city = new City();
        city.setName("New York");

        when(cityRepository.save(any(City.class))).thenReturn(city);

        // Act
        City createdCity = cityService.createCity(city);

        // Assert
        assertNotNull(createdCity);
        assertEquals("New York", createdCity.getName());
        verify(cityRepository, times(1)).save(city);
    }

    @Test
    public void cityService_GetAllCities_ReturnsCityList() {
        // Arrange
        City city1 = new City();
        city1.setName("New York");

        City city2 = new City();
        city2.setName("Los Angeles");

        when(cityRepository.findAll()).thenReturn(List.of(city1, city2));

        // Act
        List<City> cities = cityService.getAllCities();

        // Assert
        assertNotNull(cities);
        assertEquals(2, cities.size());
        assertEquals("New York", cities.get(0).getName());
        assertEquals("Los Angeles", cities.get(1).getName());
    }

    @Test
    public void cityService_GetCityById_ReturnsCity() {
        // Arrange
        UUID cityId = UUID.randomUUID();
        City city = new City();
        city.setId(cityId);
        city.setName("Chicago");

        when(cityRepository.findById(cityId)).thenReturn(Optional.of(city));

        // Act
        Optional<City> foundCity = cityService.getCityById(cityId);

        // Assert
        assertTrue(foundCity.isPresent());
        assertEquals(cityId, foundCity.get().getId());
        assertEquals("Chicago", foundCity.get().getName());
    }

    @Test
    public void cityService_UpdateCity_ReturnsUpdatedCity() {
        // Arrange
        UUID cityId = UUID.randomUUID();
        City existingCity = new City();
        existingCity.setId(cityId);
        existingCity.setName("Old Name");

        City updatedCity = new City();
        updatedCity.setName("New Name");

        when(cityRepository.findById(cityId)).thenReturn(Optional.of(existingCity));
        when(cityRepository.save(any(City.class))).thenReturn(updatedCity);

        // Act
        City result = cityService.updateCity(cityId, updatedCity);

        // Assert
        assertNotNull(result);
        assertEquals("New Name", result.getName());
        verify(cityRepository, times(1)).save(any(City.class));
    }

    @Test
    public void cityService_DeleteCity_DeletesCity() {
        // Arrange
        UUID cityId = UUID.randomUUID();

        doNothing().when(cityRepository).deleteById(cityId);

        // Act
        cityService.deleteCity(cityId);

        // Assert
        verify(cityRepository, times(1)).deleteById(cityId);
    }

    @Test
    public void cityService_SearchCitiesByName_ReturnsCityList() {
        // Arrange
        String name = "New";
        City city1 = new City();
        city1.setName("New York");

        City city2 = new City();
        city2.setName("New Orleans");

        when(cityRepository.findByNameContainingIgnoreCase(name)).thenReturn(List.of(city1, city2));

        // Act
        List<City> cities = cityService.searchCitiesByName(name);

        // Assert
        assertNotNull(cities);
        assertEquals(2, cities.size());
        assertEquals("New York", cities.get(0).getName());
        assertEquals("New Orleans", cities.get(1).getName());
    }
}