package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment.EnrollmentStatus;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;

/**
 * Servicio para manejar la lógica de negocio de las inscripciones
 */
@Service
@Transactional
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CourseService courseService;

    /**
     * Inscribe un estudiante a un curso
     */
    public Enrollment enrollStudent(Long studentId, Long courseId) {
        // Validar que el usuario existe y es estudiante
        User student = userService.findById(studentId);
        if (student == null) {
            throw new IllegalArgumentException("Estudiante no encontrado con ID: " + studentId);
        }
        
        if (student.getRole() != User.Role.STUDENT) {
            throw new IllegalArgumentException("Solo los estudiantes pueden inscribirse a cursos");
        }

        // Validar que el curso existe y está activo
        Course course = courseService.findById(courseId);
        if (course == null) {
            throw new IllegalArgumentException("Curso no encontrado con ID: " + courseId);
        }

        if (!course.getIsActive()) {
            throw new IllegalArgumentException("El curso no está disponible para inscripciones");
        }

        // Verificar que no esté ya inscrito
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalArgumentException("El estudiante ya está inscrito en este curso");
        }

        // Crear la inscripción
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);
        enrollment.setProgressPercentage(0);

        return enrollmentRepository.save(enrollment);
    }

    /**
     * Obtiene todas las inscripciones de un estudiante
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getStudentEnrollments(Long studentId) {
        return enrollmentRepository.findByStudentId(studentId);
    }

    /**
     * Obtiene las inscripciones activas de un estudiante
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getActiveStudentEnrollments(Long studentId) {
        return enrollmentRepository.findActiveByStudentId(studentId);
    }

    /**
     * Obtiene las inscripciones completadas de un estudiante
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getCompletedStudentEnrollments(Long studentId) {
        return enrollmentRepository.findCompletedByStudentId(studentId);
    }

    /**
     * Obtiene todas las inscripciones de un curso
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }

    /**
     * Obtiene las inscripciones activas de un curso
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getActiveCourseEnrollments(Long courseId) {
        return enrollmentRepository.findActiveByCourseId(courseId);
    }

    /**
     * Obtiene una inscripción específica
     */
    @Transactional(readOnly = true)
    public Optional<Enrollment> getEnrollmentById(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId);
    }

    /**
     * Obtiene una inscripción por estudiante y curso
     */
    @Transactional(readOnly = true)
    public Optional<Enrollment> getEnrollmentByStudentAndCourse(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Verifica si un estudiante está inscrito en un curso
     */
    @Transactional(readOnly = true)
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Actualiza el progreso de una inscripción
     */
    public Enrollment updateProgress(Long enrollmentId, Integer progressPercentage) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Inscripción no encontrada con ID: " + enrollmentId));

        enrollment.updateProgress(progressPercentage);
        return enrollmentRepository.save(enrollment);
    }

    /**
     * Marca un curso como completado
     */
    public Enrollment markAsCompleted(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Inscripción no encontrada con ID: " + enrollmentId));

        enrollment.markAsCompleted();
        return enrollmentRepository.save(enrollment);
    }

    /**
     * Desinscribe a un estudiante de un curso
     */
    public void unenrollStudent(Long enrollmentId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new IllegalArgumentException("Inscripción no encontrada con ID: " + enrollmentId));

        enrollment.setStatus(EnrollmentStatus.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    /**
     * Desinscribe a un estudiante de un curso específico
     */
    public void unenrollStudentFromCourse(Long studentId, Long courseId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new IllegalArgumentException("El estudiante no está inscrito en este curso"));

        enrollment.setStatus(EnrollmentStatus.DROPPED);
        enrollmentRepository.save(enrollment);
    }

    /**
     * Cuenta el número de estudiantes inscritos en un curso
     */
    @Transactional(readOnly = true)
    public long countActiveEnrollmentsByCourse(Long courseId) {
        return enrollmentRepository.countActiveEnrollmentsByCourseId(courseId);
    }

    /**
     * Obtiene estadísticas de inscripciones
     */
    @Transactional(readOnly = true)
    public List<Object[]> getEnrollmentStats() {
        return enrollmentRepository.getEnrollmentStatsByCourse();
    }

    /**
     * Obtiene el progreso promedio de un curso
     */
    @Transactional(readOnly = true)
    public Double getAverageProgressByCourse(Long courseId) {
        return enrollmentRepository.getAverageProgressByCourseId(courseId);
    }

    /**
     * Obtiene inscripciones recientes
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getRecentEnrollments() {
        java.time.LocalDateTime thirtyDaysAgo = java.time.LocalDateTime.now().minusDays(30);
        return enrollmentRepository.findRecentEnrollments(thirtyDaysAgo);
    }

    /**
     * Obtiene inscripciones por estado
     */
    @Transactional(readOnly = true)
    public List<Enrollment> getEnrollmentsByStatus(EnrollmentStatus status) {
        return enrollmentRepository.findByStatus(status);
    }
}
