package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estadísticas por categoría
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryStatsDto {
    
    private Long categoryId;
    private String categoryName;
    private String categoryColor;
    private String categoryIcon;
    private Long totalCourses;
    private Long publishedCourses;
    private Long totalEnrollments;
    private Long activeEnrollments;
    private Double averageProgress;
    private Long totalStudents;
}
