package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;
import java.util.Map;
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


@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private com.Dev_learning_Platform.Dev_learning_Platform.services.UserService userService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@RequestBody EnrollmentRequest request,
            Authentication authentication) {
        try {
            // Obtener el ID del estudiante autenticado
            Long studentId = getCurrentUserId(authentication);

            Enrollment enrollment =
                    enrollmentService.enrollStudent(studentId, request.getCourseId());
            return ResponseEntity.status(HttpStatus.CREATED).body(enrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

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

    @GetMapping("/my-courses/completed")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> getMyCompletedEnrollments(
            Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            List<Enrollment> enrollments =
                    enrollmentService.getCompletedStudentEnrollments(studentId);
            return ResponseEntity.ok(enrollments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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

    @GetMapping("/check/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentStatusResponse> checkEnrollment(@PathVariable Long courseId,
            Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);
            boolean isEnrolled = enrollmentService.isStudentEnrolled(studentId, courseId);

            EnrollmentStatusResponse response = new EnrollmentStatusResponse();
            response.setEnrolled(isEnrolled);

            if (isEnrolled) {
                Optional<Enrollment> enrollment =
                        enrollmentService.getEnrollmentByStudentAndCourse(studentId, courseId);
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

    @PutMapping("/{id}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> updateProgress(@PathVariable Long id,
            @RequestBody ProgressUpdateRequest request, Authentication authentication) {
        try {
            Long studentId = getCurrentUserId(authentication);

            // Verificar que la inscripción pertenece al estudiante autenticado
            Optional<Enrollment> enrollment = enrollmentService.getEnrollmentById(id);
            if (!enrollment.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            if (!enrollment.get().getStudent().getId().equals(studentId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        new ErrorResponse("No tienes permisos para actualizar esta inscripción"));
            }

            Enrollment updatedEnrollment =
                    enrollmentService.updateProgress(id, request.getProgressPercentage());
            return ResponseEntity.ok(updatedEnrollment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Error interno del servidor"));
        }
    }

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
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                        new ErrorResponse("No tienes permisos para completar esta inscripción"));
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

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Map<String, String>> unenrollFromCourse(@PathVariable Long id,
            Authentication authentication) {
        // 1. Obtener el usuario autenticado
        Long studentId = getCurrentUserId(authentication);
        com.Dev_learning_Platform.Dev_learning_Platform.models.User currentUser =
                userService.findById(studentId);

        // 2. Buscar la inscripción
        Optional<Enrollment> enrollmentOpt = enrollmentService.getEnrollmentById(id);
        if (!enrollmentOpt.isPresent()) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Inscripción no encontrada");
        }

        Enrollment enrollment = enrollmentOpt.get();

        // 3. Validar que la inscripción pertenece al usuario actual
        if (!enrollment.getStudent().getId().equals(currentUser.getId())) {
            throw new org.springframework.web.server.ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No tienes permisos para desinscribirte de este curso");
        }

        // 4. Realizar la desinscripción
        enrollmentService.unenrollStudent(id);

        // 5. Devolver la respuesta correcta con un cuerpo JSON
        return ResponseEntity
                .ok(java.util.Map.of("message", "Te has desinscrito exitosamente del curso"));
    }

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

    private Long getCurrentUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() != null) {
            // Obtener el email del usuario autenticado
            String userEmail = authentication.getName();

            // Buscar el usuario por email para obtener su ID
            com.Dev_learning_Platform.Dev_learning_Platform.models.User user =
                    userService.findByEmail(userEmail);

            if (user != null) {
                return user.getId();
            }
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
