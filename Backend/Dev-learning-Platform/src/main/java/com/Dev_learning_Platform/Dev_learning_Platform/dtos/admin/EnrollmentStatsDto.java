package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estadísticas de inscripciones
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentStatsDto {
    
    private Long totalEnrollments;
    private Long activeEnrollments;
    private Long completedEnrollments;
    private Long droppedEnrollments;
    private Long suspendedEnrollments;
    private Long newEnrollmentsLast30Days;
    private Long newEnrollmentsLast7Days;
    private Double averageProgressPercentage;
    private Long enrollmentsWithProgress;
}
