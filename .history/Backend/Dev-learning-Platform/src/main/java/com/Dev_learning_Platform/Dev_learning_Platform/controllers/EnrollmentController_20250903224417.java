package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para manejar las inscripciones de estudiantes a cursos.
 * Proporciona endpoints para inscribir, verificar y gestionar inscripciones.
 */
@RestController
@RequestMapping("/api/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {
    
    private final EnrollmentService enrollmentService;
    
    /**
     * Inscribe un estudiante a un curso.
     * Solo los estudiantes pueden inscribirse a cursos.
     */
    @PostMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> enrollInCourse(@PathVariable Long courseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long studentId = Long.parseLong(authentication.getName());
            
            Enrollment enrollment = enrollmentService.enrollStudent(courseId, studentId);
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene todos los cursos en los que está inscrito el estudiante autenticado.
     */
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Course>> getMyCourses() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long studentId = Long.parseLong(authentication.getName());
            
            List<Course> courses = enrollmentService.getStudentCourses(studentId);
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Verifica si el estudiante autenticado está inscrito en un curso específico.
     */
    @GetMapping("/{courseId}/status")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Boolean> getEnrollmentStatus(@PathVariable Long courseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long studentId = Long.parseLong(authentication.getName());
            
            boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);
            return ResponseEntity.ok(isEnrolled);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(false);
        }
    }
    
    /**
     * Desinscribe al estudiante autenticado de un curso.
     */
    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> unenrollFromCourse(@PathVariable Long courseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long studentId = Long.parseLong(authentication.getName());
            
            enrollmentService.unenrollStudent(courseId, studentId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene todos los estudiantes inscritos en un curso.
     * Solo los instructores y administradores pueden acceder a esta información.
     */
    @GetMapping("/course/{courseId}/students")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getCourseStudents(@PathVariable Long courseId) {
        try {
            // TODO: Agregar verificación de que el instructor es dueño del curso
            List<User> students = enrollmentService.getCourseStudents(courseId);
            return ResponseEntity.ok(students);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene el número de estudiantes inscritos en un curso.
     * Este endpoint es público para mostrar estadísticas.
     */
    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getEnrollmentCount(@PathVariable Long courseId) {
        try {
            long count = enrollmentService.getEnrollmentCount(courseId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(0L);
        }
    }
}
