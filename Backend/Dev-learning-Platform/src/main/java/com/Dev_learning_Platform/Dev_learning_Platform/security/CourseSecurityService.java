package com.Dev_learning_Platform.Dev_learning_Platform.security;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service("courseSecurityService")
public class CourseSecurityService {

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    /**
     * Verifica si un estudiante está inscrito en un curso específico
     * @param authentication Objeto de autenticación de Spring Security
     * @param courseId ID del curso a verificar
     * @return true si el estudiante está inscrito, false en caso contrario
     */
    public boolean isEnrolled(Authentication authentication, Long courseId) {
        try {
            // Obtener el ID del usuario desde el objeto de autenticación
            Long userId = getUserIdFromAuthentication(authentication);
            if (userId == null) {
                return false;
            }

            // Verificar si el usuario está inscrito en el curso
            return enrollmentService.isStudentEnrolled(userId, courseId);
        } catch (Exception e) {
            // En caso de error, denegar acceso por seguridad
            return false;
        }
    }

    /**
     * Verifica si el usuario autenticado es el instructor del curso
     * @param authentication Objeto de autenticación de Spring Security
     * @param courseId ID del curso a verificar
     * @return true si es el instructor del curso, false en caso contrario
     */
    public boolean isInstructorOfCourse(Authentication authentication, Long courseId) {
        try {
            // Obtener el ID del usuario desde el objeto de autenticación
            Long userId = getUserIdFromAuthentication(authentication);
            if (userId == null) {
                return false;
            }

            // Obtener el curso
            Course course = courseService.findById(courseId);
            if (course == null) {
                return false;
            }

            // Verificar si el usuario es el instructor del curso
            return course.getInstructor().getId().equals(userId);
        } catch (Exception e) {
            // En caso de error, denegar acceso por seguridad
            return false;
        }
    }

    /**
     * Extrae el ID del usuario desde el objeto de autenticación
     * @param authentication Objeto de autenticación de Spring Security
     * @return ID del usuario o null si no se puede obtener
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }

        try {
            // El principal debería ser un UserDetails o similar
            // Asumimos que contiene el ID del usuario
            Object principal = authentication.getPrincipal();

            // Si el principal es un User, extraer el ID directamente
            if (principal instanceof User) {
                return ((User) principal).getId();
            }

            // Si el principal es un UserDetails personalizado, intentar obtener el ID
            // Esto dependerá de cómo esté implementado tu CustomUserDetailsService
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                String username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
                User user = userService.findByEmail(username);
                return user != null ? user.getId() : null;
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
