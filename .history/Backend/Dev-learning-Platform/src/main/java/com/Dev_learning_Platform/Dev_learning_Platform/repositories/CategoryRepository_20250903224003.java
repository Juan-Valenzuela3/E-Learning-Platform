package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;

/**
 * Repositorio para manejar las operaciones de base de datos de las categorías.
 * Proporciona consultas para buscar y gestionar categorías de cursos.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    /**
     * Busca categorías por nombre (búsqueda parcial, case-insensitive).
     */
    List<Category> findByNameContainingIgnoreCase(String name);
    
    /**
     * Verifica si existe una categoría con el nombre especificado.
     */
    boolean existsByName(String name);
}
