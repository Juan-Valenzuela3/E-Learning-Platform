package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * DTO para estadísticas de ingresos
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueStatsDto {
    
    private BigDecimal totalRevenue;
    private BigDecimal revenueLast30Days;
    private BigDecimal revenueLast7Days;
    private BigDecimal averageRevenuePerCourse;
    private BigDecimal averageRevenuePerStudent;
    private Long totalPaidEnrollments;
    private Long paidEnrollmentsLast30Days;
    private Long paidEnrollmentsLast7Days;
}
