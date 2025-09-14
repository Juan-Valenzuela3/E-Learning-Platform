package com.Dev_learning_Platform.Dev_learning_Platform.models;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad para manejar las categorías de cursos.
 * Permite organizar los cursos en diferentes categorías temáticas.
 */
@Entity
@Table(name = "categories")
@Getter
@Setter
public class Category {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @OneToMany(mappedBy = "category", cascade = jakarta.persistence.CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Course> courses;
}
