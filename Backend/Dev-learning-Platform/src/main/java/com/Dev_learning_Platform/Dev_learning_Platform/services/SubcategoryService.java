package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.SubcategoryRepository;

/**
 * Servicio para manejar la lógica de negocio de las subcategorías
 */
@Service
@Transactional
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    /**
     * Obtiene todas las subcategorías activas ordenadas
     */
    @Transactional(readOnly = true)
    public List<Subcategory> getAllActiveSubcategories() {
        return subcategoryRepository.findAllActiveOrdered();
    }

    /**
     * Obtiene todas las subcategorías (activas e inactivas)
     */
    @Transactional(readOnly = true)
    public List<Subcategory> getAllSubcategories() {
        return subcategoryRepository.findAll();
    }

    /**
     * Obtiene una subcategoría por ID
     */
    @Transactional(readOnly = true)
    public Optional<Subcategory> getSubcategoryById(Long id) {
        return subcategoryRepository.findById(id);
    }

    /**
     * Obtiene todas las subcategorías activas de una categoría específica
     */
    @Transactional(readOnly = true)
    public List<Subcategory> getSubcategoriesByCategoryId(Long categoryId) {
        return subcategoryRepository.findActiveByCategoryId(categoryId);
    }

    /**
     * Obtiene una subcategoría por nombre y categoría
     */
    @Transactional(readOnly = true)
    public Optional<Subcategory> getSubcategoryByNameAndCategoryId(String name, Long categoryId) {
        return subcategoryRepository.findByNameAndCategoryId(name, categoryId);
    }

    /**
     * Busca subcategorías por término de búsqueda
     */
    @Transactional(readOnly = true)
    public List<Subcategory> searchSubcategories(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllActiveSubcategories();
        }
        return subcategoryRepository.findActiveByNameContaining(searchTerm.trim());
    }

    /**
     * Crea una nueva subcategoría
     */
    public Subcategory createSubcategory(Subcategory subcategory) {
        // Validar que el nombre no esté vacío
        if (subcategory.getName() == null || subcategory.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la subcategoría no puede estar vacío");
        }

        // Validar que la categoría exista
        if (subcategory.getCategory() == null || subcategory.getCategory().getId() == null) {
            throw new IllegalArgumentException("La categoría es requerida");
        }

        Category category = categoryRepository.findById(subcategory.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + subcategory.getCategory().getId()));

        // Validar que no exista otra subcategoría con el mismo nombre en la misma categoría
        if (subcategoryRepository.findByNameAndCategoryId(subcategory.getName().trim(), category.getId()).isPresent()) {
            throw new IllegalArgumentException("Ya existe una subcategoría con el nombre '" + subcategory.getName() + "' en la categoría '" + category.getName() + "'");
        }

        // Establecer valores por defecto
        subcategory.setName(subcategory.getName().trim());
        subcategory.setCategory(category);
        if (subcategory.getIsActive() == null) {
            subcategory.setIsActive(true);
        }
        if (subcategory.getSortOrder() == null) {
            subcategory.setSortOrder(999); // Valor por defecto para ordenar al final
        }

        return subcategoryRepository.save(subcategory);
    }

    /**
     * Actualiza una subcategoría existente
     */
    public Subcategory updateSubcategory(Long id, Subcategory subcategoryDetails) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + id));

        // Validar que el nombre no esté vacío
        if (subcategoryDetails.getName() == null || subcategoryDetails.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre de la subcategoría no puede estar vacío");
        }

        // Validar que la categoría exista si se está cambiando
        Category category = subcategory.getCategory();
        if (subcategoryDetails.getCategory() != null && subcategoryDetails.getCategory().getId() != null) {
            category = categoryRepository.findById(subcategoryDetails.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + subcategoryDetails.getCategory().getId()));
        }

        // Validar que no exista otra subcategoría con el mismo nombre en la misma categoría (excluyendo la actual)
        if (subcategoryRepository.existsByNameAndCategoryIdAndIdNot(subcategoryDetails.getName().trim(), category.getId(), id)) {
            throw new IllegalArgumentException("Ya existe otra subcategoría con el nombre '" + subcategoryDetails.getName() + "' en la categoría '" + category.getName() + "'");
        }

        // Actualizar campos
        subcategory.setName(subcategoryDetails.getName().trim());
        subcategory.setCategory(category);
        if (subcategoryDetails.getDescription() != null) {
            subcategory.setDescription(subcategoryDetails.getDescription().trim());
        }
        if (subcategoryDetails.getIcon() != null) {
            subcategory.setIcon(subcategoryDetails.getIcon().trim());
        }
        if (subcategoryDetails.getColor() != null) {
            subcategory.setColor(subcategoryDetails.getColor().trim());
        }
        if (subcategoryDetails.getIsActive() != null) {
            subcategory.setIsActive(subcategoryDetails.getIsActive());
        }
        if (subcategoryDetails.getSortOrder() != null) {
            subcategory.setSortOrder(subcategoryDetails.getSortOrder());
        }

        return subcategoryRepository.save(subcategory);
    }

    /**
     * Elimina una subcategoría (soft delete - marca como inactiva)
     */
    public void deleteSubcategory(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + id));

        // Verificar si tiene cursos asociados
        long courseCount = subcategoryRepository.countActiveCoursesBySubcategoryId(id);
        if (courseCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar la subcategoría porque tiene " + courseCount + " cursos asociados");
        }

        // Soft delete - marcar como inactiva
        subcategory.setIsActive(false);
        subcategoryRepository.save(subcategory);
    }

    /**
     * Elimina permanentemente una subcategoría
     */
    public void permanentDeleteSubcategory(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + id));

        // Verificar si tiene cursos asociados
        long courseCount = subcategoryRepository.countActiveCoursesBySubcategoryId(id);
        if (courseCount > 0) {
            throw new IllegalArgumentException("No se puede eliminar permanentemente la subcategoría porque tiene " + courseCount + " cursos asociados");
        }

        subcategoryRepository.delete(subcategory);
    }

    /**
     * Activa una subcategoría
     */
    public Subcategory activateSubcategory(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + id));

        subcategory.setIsActive(true);
        return subcategoryRepository.save(subcategory);
    }

    /**
     * Desactiva una subcategoría
     */
    public Subcategory deactivateSubcategory(Long id) {
        Subcategory subcategory = subcategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + id));

        // Verificar si tiene cursos asociados
        long courseCount = subcategoryRepository.countActiveCoursesBySubcategoryId(id);
        if (courseCount > 0) {
            throw new IllegalArgumentException("No se puede desactivar la subcategoría porque tiene " + courseCount + " cursos asociados");
        }

        subcategory.setIsActive(false);
        return subcategoryRepository.save(subcategory);
    }
}
