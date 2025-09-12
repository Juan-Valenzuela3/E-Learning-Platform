package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar las categorías de cursos.
 * Proporciona funcionalidades para crear, buscar y gestionar categorías.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {
    
    private final CategoryRepository categoryRepository;
    
    /**
     * Obtiene todas las categorías disponibles.
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    /**
     * Obtiene una categoría por su ID.
     */
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));
    }
    
    /**
     * Crea una nueva categoría.
     */
    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + category.getName());
        }
        return categoryRepository.save(category);
    }
    
    /**
     * Actualiza una categoría existente.
     */
    @Transactional
    public Category updateCategory(Long id, Category category) {
        Category existingCategory = getCategoryById(id);
        
        if (!existingCategory.getName().equals(category.getName()) && 
            categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + category.getName());
        }
        
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        
        return categoryRepository.save(existingCategory);
    }
    
    /**
     * Elimina una categoría.
     */
    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
    
    /**
     * Busca categorías por nombre.
     */
    public List<Category> searchCategories(String name) {
        return categoryRepository.findByNameContainingIgnoreCase(name);
    }
}
