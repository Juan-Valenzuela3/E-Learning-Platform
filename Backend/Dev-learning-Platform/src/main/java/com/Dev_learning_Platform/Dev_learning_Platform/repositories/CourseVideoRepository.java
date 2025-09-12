package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;

/**
 * Repositorio para manejar las operaciones de base de datos de los videos de cursos.
 * Proporciona consultas para obtener videos ordenados por índice.
 */
@Repository
public interface CourseVideoRepository extends JpaRepository<CourseVideo, Long> {
    
    List<CourseVideo> findByCourseIdOrderByOrderIndexAsc(Long courseId);
    List<CourseVideo> findByCourseIdAndIsActiveOrderByOrderIndexAsc(Long courseId, Boolean isActive);
    List<CourseVideo> findByCourseId(Long courseId);
}
