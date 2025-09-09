package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment.EnrollmentStatus;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;

/**
 * Controlador REST para manejar operaciones de inscripciones
 */
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    /**
     * Inscribe un estudiante a un curso
     */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@RequestBody EnrollmentRequest request, Authentication authentication) {
        try {
            // Obtener el ID del estudiante autenticado
            Long studentId = getCurrentUserId(authentication);
            
            Enrollment enrollment = enrollmentService.enrollStudent(studentId, request.getCourseId());
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Obtiene las inscripciones del estudiante autenticado
     */
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            List<Enrollment> enrollments = enrollmentService.getActiveStudentEnrollments(studentId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene todas las inscripciones de un estudiante (incluyendo completadas)
     */
    @GetMapping("/my-courses/all")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> getAllMyEnrollments(Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            List<Enrollment> enrollments = enrollmentService.getStudentEnrollments(studentId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene las inscripciones completadas del estudiante
     */
    @GetMapping("/my-courses/completed")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> getMyCompletedEnrollments(Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            List<Enrollment> enrollments = enrollmentService.getCompletedStudentEnrollments(studentId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene una inscripción específica
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Enrollment> getEnrollmentById(@PathVariable Long id) {
        try {
            Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
            if (enrollment.isPresent()) {
                return ResponseEntity.ok(enrollment.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Verifica si el estudiante está inscrito en un curso
     */
    @GetMapping("/check/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentStatusResponse> checkEnrollment(@PathVariable Long courseId, Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);
            
            EnrollmentStatusResponse response = new EnrollmentStatusResponse();
            response.setEnrolled(isEnrolled);
            
            if (isEnrolled) {
                Optional<Enrollment> enrollment = enrollmentService.getEnrollmentByStudentAndCourse(studentId, courseId);
                if (enrollment.isPresent()) {
                    response.setEnrollmentId(enrollment.get().getId());
                    response.setStatus(enrollment.get().getStatus());
                    response.setProgressPercentage(enrollment.get().getProgressPercentage());
                }
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Actualiza el progreso de una inscripción
     */
    @PutMapping("/{id}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateProgress(@PathVariable Long id, @RequestBody ProgressUpdateRequest request, Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            
            // Verificar que la inscripción pertenece al estudiante autenticado
            Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
            if (!enrollment.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            if (!enrollment.get().getStudent().getId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("No tienes permisos para actualizar esta inscripción"));
            }
            
            Enrollment updatedEnrollment = enrollmentService.updateProgress(id, request.getProgressPercentage());
            return ResponseEntity.ok(updatedEnrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Marca un curso como completado
     */
    @PutMapping("/{id}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> markAsCompleted(@PathVariable Long id, Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            
            // Verificar que la inscripción pertenece al estudiante autenticado
            Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
            if (!enrollment.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            if (!enrollment.get().getStudent().getId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("No tienes permisos para completar esta inscripción"));
            }
            
            Enrollment completedEnrollment = enrollmentService.markAsCompleted(id);
            return ResponseEntity.ok(completedEnrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Desinscribe al estudiante de un curso
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long id, Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            
            // Verificar que la inscripción pertenece al estudiante autenticado
            Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
            if (!enrollment.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            if (!enrollment.get().getStudent().getId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new ErrorResponse("No tienes permisos para desinscribirte de este curso"));
            }
            
            enrollmentService.unenrollStudent(id);
            return ResponseEntity.ok().body(new SuccessResponse("Te has desinscrito exitosamente del curso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

    /**
     * Obtiene las inscripciones de un curso (solo para instructores y admins)
     */
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Enrollment>> getCourseEnrollments(@PathVariable Long courseId) {
        try {
            List<Enrollment> enrollments = enrollmentService.getActiveCourseEnrollments(courseId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene estadísticas de inscripciones (solo para admins)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Object[]>> getEnrollmentStats() {
        try {
            List<Object[]> stats = enrollmentService.getEnrollmentStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene inscripciones recientes (solo para admins)
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Enrollment>> getRecentEnrollments() {
        try {
            List<Enrollment> enrollments = enrollmentService.getRecentEnrollments();
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Obtiene el ID del usuario autenticado
     */
    private Long getCurrentUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            // Aquí necesitarías implementar la lógica para obtener el ID del usuario
            // Por ahora, asumimos que el principal contiene el ID
            return Long.valueOf(authentication.getName());
        }
        throw new IllegalArgumentException("Usuario no autenticado");
    }

    // Clases DTO para requests y responses
    public static class EnrollmentRequest {
        private Long courseId;

        public Long getCourseId() {
            return courseId;
        }

        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }
    }

    public static class ProgressUpdateRequest {
        private Integer progressPercentage;

        public Integer getProgressPercentage() {
            return progressPercentage;
        }

        public void setProgressPercentage(Integer progressPercentage) {
            this.progressPercentage = progressPercentage;
        }
    }

    public static class EnrollmentStatusResponse {
        private boolean enrolled;
        private Long enrollmentId;
        private EnrollmentStatus status;
        private Integer progressPercentage;

        // Getters y setters
        public boolean isEnrolled() {
            return enrolled;
        }

        public void setEnrolled(boolean enrolled) {
            this.enrolled = enrolled;
        }

        public Long getEnrollmentId() {
            return enrollmentId;
        }

        public void setEnrollmentId(Long enrollmentId) {
            this.enrollmentId = enrollmentId;
        }

        public EnrollmentStatus getStatus() {
            return status;
        }

        public void setStatus(EnrollmentStatus status) {
            this.status = status;
        }

        public Integer getProgressPercentage() {
            return progressPercentage;
        }

        public void setProgressPercentage(Integer progressPercentage) {
            this.progressPercentage = progressPercentage;
        }
    }

    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
