package com.media.CitiesOverTimeJava.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "maps")
public class Map {

    @Id
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String name;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<City> cities; // Correctly mapped to the 'map' field in City

    // No-argument constructor for JPA
    public Map() {
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<City> getCities() {
        return cities;
    }

    public void setCities(List<City> cities) {
        if (cities == null) {
            this.cities = new ArrayList<>();
        } else {
            this.cities = cities;
            for (City city : cities) {
                if (city.getMap() != this) {
                    city.setMap(this);  // Ensure city is associated with the correct map
                }
            }
        }
    }


}