package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;


@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
   
    List<Course> findByInstructor(User instructor);
    List<Course> findByIsActive(boolean isActive);
    List<Course> findByIsActiveAndIsPublished(boolean isActive, boolean isPublished);
    
    @Query("SELECT c FROM Course c WHERE c.isActive = true AND c.isPublished = true ORDER BY c.createdAt DESC")
    List<Course> findPublicCoursesOrderByCreatedAtDesc();
    List<Course> findByInstructorAndIsActive(User instructor, boolean isActive);
    
    /**
     * Obtiene todos los cursos de una categoría específica.
     */
    List<Course> findByCategoryId(Long categoryId);
    
    /**
     * Obtiene todos los cursos publicados de una categoría específica.
     */
    List<Course> findByCategoryIdAndIsPublishedTrue(Long categoryId);
    
    /**
     * Obtiene todos los cursos de una categoría específica para un instructor.
     */
    List<Course> findByCategoryIdAndInstructor(Long categoryId, User instructor);
}