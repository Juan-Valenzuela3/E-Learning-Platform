package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentStatsDto {
    private Long totalEnrollments;
    private Long completedEnrollments;
    private Long inProgressEnrollments;
    private Double averageCompletionRate;
}