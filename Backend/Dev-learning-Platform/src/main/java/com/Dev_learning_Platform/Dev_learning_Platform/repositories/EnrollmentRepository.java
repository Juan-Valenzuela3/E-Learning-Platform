package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment.EnrollmentStatus;

/**
 * Repositorio para manejar operaciones de base de datos de inscripciones
 */
@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'ACTIVE' ORDER BY e.enrolledAt DESC")
    List<Enrollment> findActiveByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT e FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE' ORDER BY e.enrolledAt DESC")
    List<Enrollment> findActiveByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(e) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE'")
    long countActiveEnrollmentsByCourseId(@Param("courseId") Long courseId);

    List<Enrollment> findByStatus(EnrollmentStatus status);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = :status ORDER BY e.enrolledAt DESC")
    List<Enrollment> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") EnrollmentStatus status);

    @Query("SELECT e FROM Enrollment e WHERE e.student.id = :studentId AND e.status = 'COMPLETED' ORDER BY e.completedAt DESC")
    List<Enrollment> findCompletedByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT e.course.id, COUNT(e) FROM Enrollment e WHERE e.status = 'ACTIVE' GROUP BY e.course.id")
    List<Object[]> getEnrollmentStatsByCourse();

    @Query("SELECT AVG(e.progressPercentage) FROM Enrollment e WHERE e.course.id = :courseId AND e.status = 'ACTIVE'")
    Double getAverageProgressByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT e FROM Enrollment e WHERE e.enrolledAt >= :thirtyDaysAgo ORDER BY e.enrolledAt DESC")
    List<Enrollment> findRecentEnrollments(@Param("thirtyDaysAgo") java.time.LocalDateTime thirtyDaysAgo);

    List<Enrollment> findByCourse(Course course);
    
    // Métodos para estadísticas administrativas
    long countByStatus(EnrollmentStatus status);
    long countByCreatedAtAfter(LocalDateTime dateTime);
    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    List<Enrollment> findByCreatedAtAfter(LocalDateTime dateTime);
    List<Enrollment> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByCourseIsPremium(boolean isPremium);
    List<Enrollment> findByCourseIn(List<Course> courses);
}
