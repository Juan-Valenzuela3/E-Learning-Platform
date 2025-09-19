
package com.Dev_learning_Platform.Dev_learning_Platform.services;

import org.springframework.stereotype.Service;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.AdminStatsDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.UserStatsDto;
import static com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.ADMIN;
import static com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.INSTRUCTOR;
import static com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.STUDENT;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para generar estadísticas de administración
 */
@Slf4j
@Service
@RequiredArgsConstructor

public class AdminStatsService {

    private final UserRepository userRepository;
    private final com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository courseRepository;
    private final com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseVideoRepository courseVideoRepository;

    /**
     * Obtiene todas las estadísticas de la plataforma - Versión simplificada
     */
    public AdminStatsDto getAllStats() {
        try {
            log.info("Generando estadísticas completas de la plataforma");

        return AdminStatsDto.builder()
            .userStats(getUserStats())
            .courseStats(getCourseStats())
            .build();

        } catch (Exception e) {
            log.error("❌ Error construyendo estadísticas de administrador: {}", e.getMessage(), e);
            throw new RuntimeException("❌ Error construyendo estadísticas de administrador", e);
        }
    }

    /**
     * Obtiene estadísticas de cursos
     */
    public com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.CourseStatsDto getCourseStats() {
        try {
            log.info("Obteniendo estadísticas de cursos...");
            long totalCourses = courseRepository.count();
            long publishedCourses = courseRepository.countByIsPublished(true);
            long draftCourses = courseRepository.countByIsPublished(false);
            long totalLessons = courseVideoRepository.count();
            long totalMinutes = courseVideoRepository.findAll().stream()
                .filter(v -> v.getDurationSeconds() != null)
                .mapToLong(v -> v.getDurationSeconds() / 60)
                .sum();

            return com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.CourseStatsDto.builder()
                    .totalCourses(totalCourses)
                    .publishedCourses(publishedCourses)
                    .draftCourses(draftCourses)
                    .totalLessons(totalLessons)
                    .totalMinutes(totalMinutes)
                    .build();
        } catch (Exception e) {
            log.error("❌ Error obteniendo estadísticas de cursos: {}", e.getMessage(), e);
            throw new RuntimeException("❌ Error obteniendo estadísticas de cursos", e);
        }
    }
        /**
         * Retorna el total de estudiantes registrados
         */
        public long getTotalStudents() {
            return userRepository.countByRole(STUDENT);
        }

        /**
         * Retorna el total de instructores registrados
         */
        public long getTotalInstructors() {
            return userRepository.countByRole(INSTRUCTOR);
        }
    /**
     * Obtiene estadísticas de usuarios - Versión simplificada siguiendo el ejemplo
     */
    public UserStatsDto getUserStats() {
        try {
            log.info("Obteniendo estadísticas de usuarios...");
            
            long total = userRepository.count();
            log.info("Total usuarios: {}", total);
            
            long active = userRepository.countByIsActive(true);
            log.info("Usuarios activos: {}", active);
            
            long inactive = userRepository.countByIsActive(false);
            log.info("Usuarios inactivos: {}", inactive);

        // Contar usuarios por rol de forma limpia
        long totalStudents = userRepository.countByRole(STUDENT);
        long totalInstructors = userRepository.countByRole(INSTRUCTOR);
        long totalAdmins = userRepository.countByRole(ADMIN);

        return UserStatsDto.builder()
            .totalUsers(total)
            .activeUsers(active)
            .inactiveUsers(inactive)
            .totalStudents(totalStudents)
            .totalInstructors(totalInstructors)
            .totalAdmins(totalAdmins)
            .newUsersLast30Days(0L)
            .newUsersLast7Days(0L)
            .build();

        } catch (Exception e) {
            log.error("❌ Error al obtener estadísticas de usuarios: {}", e.getMessage(), e);
            throw new RuntimeException("❌ Error al obtener estadísticas de usuarios", e);
        }
    }

    // Métodos adicionales se agregarán gradualmente una vez que el básico funcione
}
