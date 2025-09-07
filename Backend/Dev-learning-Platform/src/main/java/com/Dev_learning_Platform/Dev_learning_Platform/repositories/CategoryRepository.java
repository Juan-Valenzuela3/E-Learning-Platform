package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;

/**
 * Repositorio para manejar operaciones de base de datos de categorías
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Busca una categoría por nombre
     */
    Optional<Category> findByName(String name);

    /**
     * Busca todas las categorías activas ordenadas por sortOrder
     */
    @Query("SELECT c FROM Category c WHERE c.isActive = true ORDER BY c.sortOrder ASC, c.name ASC")
    List<Category> findAllActiveOrdered();

    /**
     * Busca categorías que contengan el texto especificado en el nombre
     */
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY c.sortOrder ASC, c.name ASC")
    List<Category> findActiveByNameContaining(@Param("searchTerm") String searchTerm);

    /**
     * Verifica si existe una categoría con el nombre especificado (excluyendo un ID específico)
     */
    @Query("SELECT COUNT(c) > 0 FROM Category c WHERE c.name = :name AND c.id != :excludeId")
    boolean existsByNameAndIdNot(@Param("name") String name, @Param("excludeId") Long excludeId);

    /**
     * Cuenta el número de cursos activos en una categoría
     */
    @Query("SELECT COUNT(c) FROM Course c WHERE c.category.id = :categoryId AND c.isActive = true")
    long countActiveCoursesByCategoryId(@Param("categoryId") Long categoryId);
}
