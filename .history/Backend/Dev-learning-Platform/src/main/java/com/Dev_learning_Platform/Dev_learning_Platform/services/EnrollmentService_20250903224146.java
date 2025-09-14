package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar las inscripciones de estudiantes a cursos.
 * Proporciona funcionalidades para inscribir, verificar y obtener inscripciones.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EnrollmentService {
    
    private final EnrollmentRepository enrollmentRepository;
    private final CourseService courseService;
    private final UserService userService;
    
    /**
     * Inscribe un estudiante a un curso.
     * Valida que el curso exista, esté publicado y el estudiante no esté ya inscrito.
     */
    @Transactional
    public Enrollment enrollStudent(Long courseId, Long studentId) {
        // Verificar que el curso existe y está publicado
        Course course = courseService.findById(courseId);
        if (!course.getIsPublished()) {
            throw new IllegalArgumentException("El curso no está disponible para inscripción");
        }
        
        // Verificar que el usuario existe y es estudiante
        User student = userService.findById(studentId);
        if (student.getRole() != User.Role.STUDENT) {
            throw new IllegalArgumentException("Solo los estudiantes pueden inscribirse a cursos");
        }
        
        // Verificar que no esté ya inscrito
        if (enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            throw new IllegalArgumentException("Ya estás inscrito en este curso");
        }
        
        // Crear la inscripción
        Enrollment enrollment = new Enrollment();
        enrollment.setStudent(student);
        enrollment.setCourse(course);
        
        return enrollmentRepository.save(enrollment);
    }
    
    /**
     * Verifica si un estudiante está inscrito en un curso.
     */
    public boolean isStudentEnrolled(Long studentId, Long courseId) {
        return enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }
    
    /**
     * Obtiene todos los cursos en los que está inscrito un estudiante.
     */
    public List<Course> getStudentCourses(Long studentId) {
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(studentId);
        return enrollments.stream()
                .map(Enrollment::getCourse)
                .toList();
    }
    
    /**
     * Obtiene todos los estudiantes inscritos en un curso.
     */
    public List<User> getCourseStudents(Long courseId) {
        List<Enrollment> enrollments = enrollmentRepository.findByCourseId(courseId);
        return enrollments.stream()
                .map(Enrollment::getStudent)
                .toList();
    }
    
    /**
     * Obtiene una inscripción específica.
     */
    public Enrollment getEnrollment(Long studentId, Long courseId) {
        return enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró la inscripción"));
    }
    
    /**
     * Cuenta cuántos estudiantes están inscritos en un curso.
     */
    public long getEnrollmentCount(Long courseId) {
        return enrollmentRepository.countByCourseId(courseId);
    }
    
    /**
     * Desinscribe a un estudiante de un curso.
     */
    @Transactional
    public void unenrollStudent(Long courseId, Long studentId) {
        Enrollment enrollment = getEnrollment(studentId, courseId);
        enrollmentRepository.delete(enrollment);
    }
}
