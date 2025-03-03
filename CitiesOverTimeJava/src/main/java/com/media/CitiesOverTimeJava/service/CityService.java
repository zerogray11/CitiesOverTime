package com.media.CitiesOverTimeJava.service;

import com.media.CitiesOverTimeJava.model.City;
import com.media.CitiesOverTimeJava.repository.CityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CityService {
    @Autowired
    private CityRepository cityRepository;

    public City createCity(City city) {
        return cityRepository.save(city);
    }

    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    public Optional<City> getCityById(UUID id) {
        return cityRepository.findById(id);
    }

    public City updateCity(UUID id, City updatedCity) {
        City existingCity = cityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
        existingCity.setName(updatedCity.getName());
        existingCity.setTaxLevel(updatedCity.getTaxLevel());
        existingCity.setClimateChangeVulnerability(updatedCity.getClimateChangeVulnerability());
        existingCity.setPolitics(updatedCity.getPolitics());
        existingCity.setClimate(updatedCity.getClimate());
        existingCity.setAverageIncome(updatedCity.getAverageIncome());
        existingCity.setNaturalDisasters(updatedCity.getNaturalDisasters());
        existingCity.setEntertainment(updatedCity.getEntertainment());
        existingCity.setAverageAge(updatedCity.getAverageAge());
        return cityRepository.save(existingCity);
    }

    public void deleteCity(UUID id) {
        cityRepository.deleteById(id);
    }

    public List<City> searchCitiesByName(String name) {
        return cityRepository.findByNameContainingIgnoreCase(name);
    }
}