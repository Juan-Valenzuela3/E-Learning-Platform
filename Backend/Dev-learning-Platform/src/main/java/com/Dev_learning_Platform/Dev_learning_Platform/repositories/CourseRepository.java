package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;


@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
   
    List<Course> findByInstructor(User instructor);
    List<Course> findByIsActive(boolean isActive);
    List<Course> findByIsActiveAndIsPublished(boolean isActive, boolean isPublished);
    
    // Método paginado para cursos públicos
    Page<Course> findByIsActiveAndIsPublished(boolean isActive, boolean isPublished, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.isActive = true AND c.isPublished = true ORDER BY c.createdAt DESC")
    List<Course> findPublicCoursesOrderByCreatedAtDesc();
    List<Course> findByInstructorAndIsActive(User instructor, boolean isActive);
    
    // Métodos para búsqueda por categoría y subcategoría
    List<Course> findByCategoryAndIsActiveAndIsPublished(Category category, boolean isActive, boolean isPublished);
    List<Course> findBySubcategoryAndIsActiveAndIsPublished(Subcategory subcategory, boolean isActive, boolean isPublished);
    List<Course> findByCategoryAndSubcategoryAndIsActiveAndIsPublished(Category category, Subcategory subcategory, boolean isActive, boolean isPublished);
    
    // Métodos para búsqueda con ordenamiento
    @Query("SELECT c FROM Course c WHERE c.category = :category AND c.isActive = true AND c.isPublished = true ORDER BY c.createdAt DESC")
    List<Course> findByCategoryOrderByCreatedAtDesc(Category category);
    
    @Query("SELECT c FROM Course c WHERE c.subcategory = :subcategory AND c.isActive = true AND c.isPublished = true ORDER BY c.createdAt DESC")
    List<Course> findBySubcategoryOrderByCreatedAtDesc(Subcategory subcategory);
    
    @Query("SELECT c FROM Course c WHERE c.category = :category AND c.subcategory = :subcategory AND c.isActive = true AND c.isPublished = true ORDER BY c.createdAt DESC")
    List<Course> findByCategoryAndSubcategoryOrderByCreatedAtDesc(Category category, Subcategory subcategory);
    
    // Métodos para estadísticas administrativas
    long countByIsPublished(boolean isPublished);
    long countByIsPremium(boolean isPremium);
    long countByIsActive(boolean isActive);
    long countByCreatedAtAfter(LocalDateTime dateTime);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Course> findByIsPremium(boolean isPremium);
    List<Course> findByCategory(Category category);
}