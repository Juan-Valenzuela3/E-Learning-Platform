package com.Dev_learning_Platform.Dev_learning_Platform.services;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.*;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio para generar estadísticas de administración
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private final UserRepository userRepository;

    /**
     * Obtiene todas las estadísticas de la plataforma - Versión simplificada
     */
    public AdminStatsDto getAllStats() {
        try {
            log.info("Generando estadísticas completas de la plataforma");
            
            return AdminStatsDto.builder()
                    .userStats(getUserStats())
                    // Por ahora solo estadísticas de usuarios, agregaremos el resto gradualmente
                    .courseStats(null)
                    .enrollmentStats(null)
                    .revenueStats(null)
                    .categoryDistribution(null)
                    .growthStats(null)
                    .build();

        } catch (Exception e) {
            log.error("❌ Error construyendo estadísticas de administrador: {}", e.getMessage(), e);
            throw new RuntimeException("❌ Error construyendo estadísticas de administrador", e);
        }
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

            // Por ahora solo retornamos los campos básicos
            return UserStatsDto.builder()
                    .totalUsers(total)
                    .activeUsers(active)
                    .inactiveUsers(inactive)
                    .totalStudents(0L)
                    .totalInstructors(0L)
                    .totalAdmins(0L)
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
