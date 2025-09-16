package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service("courseSecurityService") // El nombre "courseSecurityService" es crucial para que @PreAuthorize lo encuentre
@RequiredArgsConstructor
public class CourseSecurityService {

    // Asumimos que tienes estos repositorios. Si no, necesitarás crearlos.
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserService userService;

    /**
     * Verifica si el usuario autenticado está inscrito en un curso específico.
     * @param authentication El objeto de autenticación de Spring Security.
     * @param courseId El ID del curso a verificar.
     * @return true si está inscrito, false en caso contrario.
     */
    public boolean isEnrolled(Authentication authentication, Long courseId) {
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof UserDetails)) {
            return false;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();

        // 1. Encontrar el usuario por su email para obtener el ID
        User user = userService.findByEmail(userEmail);
        if (user == null) {
            return false; // Si el usuario no existe en la DB, no puede estar inscrito.
        }

        // 2. Usar el método existente en el repositorio con el ID del usuario
        return enrollmentRepository.existsByStudentIdAndCourseId(user.getId(), courseId);
    }

    /**
     * Verifica si el usuario autenticado es el instructor del curso.
     * @param authentication El objeto de autenticación de Spring Security.
     * @param courseId El ID del curso a verificar.
     * @return true si es el instructor, false en caso contrario.
     */
    public boolean isInstructorOfCourse(Authentication authentication, Long courseId) {
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof UserDetails)) {
            return false;
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String userEmail = userDetails.getUsername();

        return courseRepository.findById(courseId)
                .map(course -> course.getInstructor().getEmail().equals(userEmail))
                .orElse(false);
    }
}
