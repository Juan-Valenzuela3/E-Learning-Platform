package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrowthStatsDto {
    private Double userGrowthRate;
    private Double enrollmentGrowthRate;
    private Double revenueGrowthRate;
    private Long newUsersThisMonth;
    private Long newEnrollmentsThisMonth;
}