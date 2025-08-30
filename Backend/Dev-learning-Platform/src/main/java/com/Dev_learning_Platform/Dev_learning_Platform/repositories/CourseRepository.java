package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

/**
 * Repositorio básico para cursos.
 */
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    /**
     * Buscar cursos por instructor
     */
    List<Course> findByInstructor(User instructor);
    
    /**
     * Buscar cursos por estado de actividad
     */
    List<Course> findByIsActive(boolean isActive);
}
