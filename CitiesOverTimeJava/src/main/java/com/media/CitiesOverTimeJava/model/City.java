package com.media.CitiesOverTimeJava.model;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "cities")
public class City {

    @Id
    @Column(columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID id = UUID.randomUUID();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String taxLevel; // Low, Medium, High

    @Column(nullable = false)
    private String climateChangeVulnerability; // Vulnerable, Sturdy

    @Column(nullable = false)
    private String politics; // Left, Right, Middle

    @Column(nullable = false)
    private String climate; // Mild, Cold, Hot

    @Column(nullable = false)
    private String averageIncome; // Low, Medium, High

    @Column(nullable = false)
    private String naturalDisasters; // Low, Medium, High

    @Column(nullable = false)
    private String entertainment; // Fun, Boring

    @Column(nullable = false)
    private int averageAge;

    @ManyToOne
    @JoinColumn(name = "map_id", nullable = true) // Foreign key to map
    private Map map;

    // No-argument constructor for JPA
    public City() {
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

    public String getTaxLevel() {
        return taxLevel;
    }

    public void setTaxLevel(String taxLevel) {
        this.taxLevel = taxLevel;
    }

    public String getClimateChangeVulnerability() {
        return climateChangeVulnerability;
    }

    public void setClimateChangeVulnerability(String climateChangeVulnerability) {
        this.climateChangeVulnerability = climateChangeVulnerability;
    }

    public String getPolitics() {
        return politics;
    }

    public void setPolitics(String politics) {
        this.politics = politics;
    }

    public String getClimate() {
        return climate;
    }

    public void setClimate(String climate) {
        this.climate = climate;
    }

    public String getAverageIncome() {
        return averageIncome;
    }

    public void setAverageIncome(String averageIncome) {
        this.averageIncome = averageIncome;
    }

    public String getNaturalDisasters() {
        return naturalDisasters;
    }

    public void setNaturalDisasters(String naturalDisasters) {
        this.naturalDisasters = naturalDisasters;
    }

    public String getEntertainment() {
        return entertainment;
    }

    public void setEntertainment(String entertainment) {
        this.entertainment = entertainment;
    }

    public int getAverageAge() {
        return averageAge;
    }

    public void setAverageAge(int averageAge) {
        this.averageAge = averageAge;
    }

    public Map getMap() {
        return map;
    }

    public void setMap(Map map) {
        this.map = map;
    }
}