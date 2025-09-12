package com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para estadísticas de usuarios
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsDto {
    
    private Long totalUsers;
    private Long totalStudents;
    private Long totalInstructors;
    private Long totalAdmins;
    private Long activeUsers;
    private Long inactiveUsers;
    private Long newUsersLast30Days;
    private Long newUsersLast7Days;
}
