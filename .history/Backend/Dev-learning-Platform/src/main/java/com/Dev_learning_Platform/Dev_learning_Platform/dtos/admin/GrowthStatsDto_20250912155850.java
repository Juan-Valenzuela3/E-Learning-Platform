package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estadísticas de crecimiento
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GrowthStatsDto {
    
    private Double userGrowthPercentage;
    private Double courseGrowthPercentage;
    private Double enrollmentGrowthPercentage;
    private Double revenueGrowthPercentage;
    private Long newUsersThisMonth;
    private Long newCoursesThisMonth;
    private Long newEnrollmentsThisMonth;
    private Double averageDailyActiveUsers;
}
