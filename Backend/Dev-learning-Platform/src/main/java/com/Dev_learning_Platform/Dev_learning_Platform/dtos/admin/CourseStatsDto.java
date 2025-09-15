package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseStatsDto {
    private Long totalCourses;
    private Long publishedCourses;
    private Long draftCourses;
    private Long totalLessons;
    private Long totalMinutes;
}