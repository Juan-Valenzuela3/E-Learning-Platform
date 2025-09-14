package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.AdminStatsDto;
import com.Dev_learning_Platform.Dev_learning_Platform.services.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para estadísticas de administración - Versión simplificada
 */
@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsDto> getAdminStats() {
        return ResponseEntity.ok(adminStatsService.getAllStats());
    }
}
