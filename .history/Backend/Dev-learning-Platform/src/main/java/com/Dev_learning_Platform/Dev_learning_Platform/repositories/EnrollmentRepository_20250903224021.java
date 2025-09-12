package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;

/**
 * Repositorio para manejar las operaciones de base de datos de las inscripciones.
 * Proporciona consultas para verificar y obtener inscripciones de estudiantes.
 */
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    /**
     * Verifica si un estudiante ya está inscrito en un curso específico.
     */
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    
    /**
     * Obtiene todas las inscripciones de un estudiante.
     */
    List<Enrollment> findByStudentId(Long studentId);
    
    /**
     * Obtiene todas las inscripciones de un curso.
     */
    List<Enrollment> findByCourseId(Long courseId);
    
    /**
     * Obtiene una inscripción específica de un estudiante en un curso.
     */
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    /**
     * Cuenta cuántos estudiantes están inscritos en un curso.
     */
    long countByCourseId(Long courseId);
}
