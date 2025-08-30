package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para endpoints protegidos que requieren autenticación JWT.
 * 
 * Este controlador proporciona endpoints que solo pueden ser accedidos
 * con un token JWT válido. Sirve como ejemplo de cómo implementar
 * funcionalidades protegidas en la plataforma.
 * 
 * Características:
 * - Todos los endpoints requieren autenticación JWT válida
 * - Acceso a información del usuario autenticado
 * - Ejemplos de operaciones protegidas
 * - Configurado bajo /api/protected/**
 * 
 * Uso:
 * - Dashboard de usuario
 * - Perfil de usuario
 * - Operaciones que requieren autenticación
 * - Ejemplos de implementación de seguridad
 */
@RestController
@RequestMapping("/api/protected")
@CrossOrigin(origins = "*")
public class ProtectedController {

    /**
     * Endpoint para obtener información del perfil del usuario autenticado.
     * 
     * Este endpoint demuestra cómo acceder a la información del usuario
     * autenticado desde el contexto de seguridad de Spring.
     * 
     * @return Información del perfil incluyendo nombre y roles del usuario
     */
    @GetMapping("/profile")
    public String getProfile() {
        // Obtener información de autenticación desde el contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return "Perfil del usuario: " + authentication.getName() + 
               " con roles: " + authentication.getAuthorities();
    }

    /**
     * Endpoint para acceder al dashboard protegido del usuario.
     * 
     * Este endpoint simula un dashboard que solo puede ser accedido
     * por usuarios autenticados.
     * 
     * @return Mensaje confirmando acceso al dashboard
     */
    @GetMapping("/dashboard")
    public String getDashboard() {
        // Obtener usuario autenticado para personalizar el dashboard
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return "Dashboard protegido para: " + authentication.getName();
    }

    /**
     * Endpoint para actualizar el perfil del usuario autenticado.
     * 
     * Este endpoint simula una operación de actualización que requiere
     * autenticación. En una implementación real, recibiría datos del cliente.
     * 
     * @return Mensaje confirmando la actualización del perfil
     */
    @PostMapping("/update")
    public String updateProfile() {
        // Obtener usuario autenticado para la operación de actualización
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return "Perfil actualizado para: " + authentication.getName();
    }
}
