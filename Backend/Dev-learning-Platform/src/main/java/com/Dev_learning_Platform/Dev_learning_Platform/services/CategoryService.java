package com.Dev_learning_Platform.Dev_learning_Platform.services;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CategoryPublicDto;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;


@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;


    @Transactional(readOnly = true)
    public List<CategoryPublicDto> getAllActiveCategories() {
        List<Category> categories = categoryRepository.findAllActiveOrdered();
        return categories.stream().map(this::toCategoryPublicDto).toList();
    }

    private CategoryPublicDto toCategoryPublicDto(Category category) {
        List<CategoryPublicDto.SubcategoryPublicDto> subDtos = category.getSubcategories() != null ?
            category.getSubcategories().stream().map(sub ->
                new CategoryPublicDto.SubcategoryPublicDto(
                    sub.getId(),
                    sub.getName(),
                    sub.getDescription(),
                    sub.getIcon(),
                    sub.getColor(),
                    sub.getIsActive(),
                    sub.getSortOrder()
                )
            ).toList() : List.of();
        return new CategoryPublicDto(
            category.getId(),
            category.getName(),
            category.getDescription(),
            category.getIcon(),
            category.getColor(),
            category.getIsActive(),
            category.getSortOrder(),
            subDtos
        );
    }

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Transactional(readOnly = true)
    public List<Category> searchCategories(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return categoryRepository.findAllActiveOrdered();
        }
        return categoryRepository.findActiveByNameContaining(searchTerm.trim());
    }

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

    public Category activateCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + id));

        category.setIsActive(true);
        return categoryRepository.save(category);
    }

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
