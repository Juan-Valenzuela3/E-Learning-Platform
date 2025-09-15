package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    private UserStatsDto userStats;
    private CourseStatsDto courseStats;
    private EnrollmentStatsDto enrollmentStats;
    private RevenueStatsDto revenueStats;
    private CategoryDistributionDto categoryDistribution;
    private GrowthStatsDto growthStats;
}
