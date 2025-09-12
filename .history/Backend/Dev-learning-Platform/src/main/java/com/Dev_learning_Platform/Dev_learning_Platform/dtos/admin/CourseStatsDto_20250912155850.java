package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estadísticas de cursos
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseStatsDto {
    
    private Long totalCourses;
    private Long publishedCourses;
    private Long draftCourses;
    private Long premiumCourses;
    private Long freeCourses;
    private Long activeCourses;
    private Long inactiveCourses;
    private Long newCoursesLast30Days;
    private Long newCoursesLast7Days;
    private Double averageCoursePrice;
    private Integer totalEstimatedHours;
}
