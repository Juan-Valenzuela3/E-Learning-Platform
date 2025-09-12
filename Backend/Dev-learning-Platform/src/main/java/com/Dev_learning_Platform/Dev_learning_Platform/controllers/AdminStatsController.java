package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.AdminStatsDto;
import com.Dev_learning_Platform.Dev_learning_Platform.services.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para estadísticas de administración
 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Endpoint de estadísticas funcionando correctamente");
    }

    @GetMapping("/test-no-auth")
    public ResponseEntity<String> testNoAuthEndpoint() {
        return ResponseEntity.ok("Endpoint sin autorización funcionando correctamente");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminStatsDto> getAllStats() {
        AdminStatsDto stats = adminStatsService.getAllStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserStats() {
        return ResponseEntity.ok(adminStatsService.getUserStats());
    }

    @GetMapping("/courses")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCourseStats() {
        return ResponseEntity.ok(adminStatsService.getCourseStats());
    }

    @GetMapping("/enrollments")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getEnrollmentStats() {
        return ResponseEntity.ok(adminStatsService.getEnrollmentStats());
    }

    @GetMapping("/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenueStats() {
        return ResponseEntity.ok(adminStatsService.getRevenueStats());
    }

    @GetMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCategoryDistribution() {
        return ResponseEntity.ok(adminStatsService.getCategoryDistribution());
    }

    @GetMapping("/growth")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getGrowthStats() {
        return ResponseEntity.ok(adminStatsService.getGrowthStats());
    }
}
