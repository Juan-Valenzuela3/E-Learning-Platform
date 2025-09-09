package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment.EnrollmentStatus;

/**
 * Repositorio para manejar operaciones de base de datos de inscripciones
 */
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    /**
     * Busca una inscripción por estudiante y curso
     */
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);

    /**
     * Verifica si un estudiante está inscrito en un curso
     */
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    /**
     * Obtiene todas las inscripciones de un estudiante
     */
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByStudentId(@Param("studentId") Long studentId);

    /**
     * Obtiene todas las inscripciones activas de un estudiante
     */
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'ACTIVE' ORDER BY e.enrolledAt DESC")
    List<Enrollment> findActiveByStudentId(@Param("studentId") Long studentId);

    /**
     * Obtiene todas las inscripciones de un curso
     */
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByCourseId(@Param("courseId") Long courseId);

    /**
     * Obtiene todas las inscripciones activas de un curso
     */
    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE' ORDER BY e.enrolledAt DESC")
    List<Enrollment> findActiveByCourseId(@Param("courseId") Long courseId);

    /**
     * Cuenta el número de estudiantes inscritos en un curso
     */
    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE'")
    long countActiveEnrollmentsByCourseId(@Param("courseId") Long courseId);

    /**
     * Obtiene inscripciones por estado
     */
    List<Enrollment> findByStatus(EnrollmentStatus status);

    /**
     * Obtiene inscripciones de un estudiante por estado
     */
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = :status ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") EnrollmentStatus status);

    /**
     * Obtiene inscripciones completadas de un estudiante
     */
    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'COMPLETED' ORDER BY e.completedAt DESC")
    List<Enrollment> findCompletedByStudentId(@Param("studentId") Long studentId);

    /**
     * Obtiene estadísticas de inscripciones por curso
     */
    @Query("SELECT e.course.id, COUNT(e) FROM Enrollment e WHERE e.status = 'ACTIVE' GROUP BY e.course.id")
    List<Object[]> getEnrollmentStatsByCourse();

    /**
     * Obtiene el progreso promedio de un curso
     */
    @Query("SELECT AVG(e.progressPercentage) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE'")
    Double getAverageProgressByCourseId(@Param("courseId") Long courseId);

    /**
     * Obtiene inscripciones recientes (últimos 30 días)
     */
    @Query("SELECT e FROM Enrollment e WHERE e.enrolledAt >= :thirtyDaysAgo ORDER BY e.enrolledAt DESC")
    List<Enrollment> findRecentEnrollments(@Param("thirtyDaysAgo") java.time.LocalDateTime thirtyDaysAgo);
}
