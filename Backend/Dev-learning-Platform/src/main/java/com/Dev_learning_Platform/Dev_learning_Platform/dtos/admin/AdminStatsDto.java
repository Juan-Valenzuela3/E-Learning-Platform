package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para las estadísticas generales de la plataforma
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    
    // Estadísticas de usuarios
    private UserStatsDto userStats;
    
    // Estadísticas de cursos
    private CourseStatsDto courseStats;
    
    // Estadísticas de inscripciones
    private EnrollmentStatsDto enrollmentStats;
    
    // Estadísticas de ingresos
    private RevenueStatsDto revenueStats;
    
    // Distribución por categorías
    private List<CategoryStatsDto> categoryDistribution;
    
    // Estadísticas de crecimiento (últimos 30 días)
    private GrowthStatsDto growthStats;
}
