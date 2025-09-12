package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador de prueba para verificar la autorización de administrador
 */
@RestController
@RequestMapping("/api/admin/test")
public class TestAdminController {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> testAdminAccess() {
        return ResponseEntity.ok("Acceso de administrador funcionando correctamente");
    }

    @GetMapping("/no-auth")
    public ResponseEntity<String> testNoAuth() {
        return ResponseEntity.ok("Endpoint sin autorización funcionando");
    }
}
