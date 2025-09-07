package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;

/**
 * Servicio para manejar la lógica de negocio de las categorías
 */
@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Obtiene todas las categorías activas ordenadas
     */
    @Transactional(readOnly = true)
    public List<Category> getAllActiveCategories() {
        return categoryRepository.findAllActiveOrdered();
    }

    /**
     * Obtiene todas las categorías (activas e inactivas)
     */
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Obtiene una categoría por ID
     */
    @Transactional(readOnly = true)
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    /**
     * Obtiene una categoría por nombre
     */
    @Transactional(readOnly = true)
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    /**
     * Busca categorías por término de búsqueda
     */
    @Transactional(readOnly = true)
    public List<Category> searchCategories(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllActiveCategories();
        }
        return categoryRepository.findActiveByNameContaining(searchTerm.trim());
    }

    /**
     * Crea una nueva categoría
     */
    public Category createCategory(Category category) {
        // Validar que el nombre no esté vacío
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }

        // Validar que no exista otra categoría con el mismo nombre
        if (categoryRepository.findByName(category.getName().trim()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + category.getName());
        }

        // Establecer valores por defecto
        category.setName(category.getName().trim());
        if (category.getIsActive() == null) {
            category.setIsActive(true);
        }
        if (category.getSortOrder() == null) {
            category.setSortOrder(999); // Valor por defecto para ordenar al final
        }

        return categoryRepository.save(category);
    }

    /**
     * Actualiza una categoría existente
     */
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        // Validar que el nombre no esté vacío
        if (categoryDetails.getName() == null || categoryDetails.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la categoría no puede estar vacío");
        }

        // Validar que no exista otra categoría con el mismo nombre (excluyendo la actual)
        if (categoryRepository.existsByNameAndIdNot(categoryDetails.getName().trim(), id)) {
            throw new IllegalArgumentException("Ya existe otra categoría con el nombre: " + categoryDetails.getName());
        }

        // Actualizar campos
        category.setName(categoryDetails.getName().trim());
        if (categoryDetails.getDescription() != null) {
            category.setDescription(categoryDetails.getDescription().trim());
        }
        if (categoryDetails.getIcon() != null) {
            category.setIcon(categoryDetails.getIcon().trim());
        }
        if (categoryDetails.getColor() != null) {
            category.setColor(categoryDetails.getColor().trim());
        }
        if (categoryDetails.getIsActive() != null) {
            category.setIsActive(categoryDetails.getIsActive());
        }
        if (categoryDetails.getSortOrder() != null) {
            category.setSortOrder(categoryDetails.getSortOrder());
        }

        return categoryRepository.save(category);
    }

    /**
     * Elimina una categoría (soft delete - marca como inactiva)
     */
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        // Verificar si tiene cursos asociados
        long courseCount = categoryRepository.countActiveCoursesByCategoryId(id);
        if (courseCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar la categoría porque tiene " + courseCount + " cursos asociados");
        }

        // Soft delete - marcar como inactiva
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    /**
     * Elimina permanentemente una categoría
     */
    public void permanentDeleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        // Verificar si tiene cursos asociados
        long courseCount = categoryRepository.countActiveCoursesByCategoryId(id);
        if (courseCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar permanentemente la categoría porque tiene " + courseCount + " cursos asociados");
        }

        categoryRepository.delete(category);
    }

    /**
     * Activa una categoría
     */
    public Category activateCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        category.setIsActive(true);
        return categoryRepository.save(category);
    }

    /**
     * Desactiva una categoría
     */
    public Category deactivateCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        // Verificar si tiene cursos asociados
        long courseCount = categoryRepository.countActiveCoursesByCategoryId(id);
        if (courseCount > 0) {
            throw new IllegalArgumentException("No se puede desactivar la categoría porque tiene " + courseCount + " cursos asociados");
        }

        category.setIsActive(false);
        return categoryRepository.save(category);
    }
}
