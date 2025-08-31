package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador para endpoints públicos que no requieren autenticación.
 * 
 * Este controlador proporciona endpoints que pueden ser accedidos
 * sin necesidad de autenticación JWT. Útil para:
 * - Información pública de la plataforma
 * - Endpoints de prueba y verificación
 * - Información general del sistema
 * 
 * Características:
 * - Endpoints accesibles sin token JWT
 * - Información no sensible
 * - Respuestas simples y directas
 * - Configurado bajo /api/public/**
 * 
 * Uso:
 * - Pruebas de conectividad
 * - Información pública del sistema
 * - Verificación de estado del servidor
 */
@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    @Autowired
    private UserService userService;

    /**
     * Endpoint de saludo público para verificar conectividad.
     * 
     * Este endpoint se usa principalmente para:
     * - Verificar que el servidor esté funcionando
     * - Probar conectividad desde el cliente
     * - Confirmar que los endpoints públicos son accesibles
     * 
     * @return Mensaje de saludo confirmando que el endpoint funciona
     */
    @GetMapping("/hello")
    public String hello() {
        return "¡Hola! Este es un endpoint público que no requiere autenticación.";
    }

    /**
     * Endpoint para obtener información pública de la plataforma.
     * 
     * Este endpoint proporciona información general sobre la plataforma
     * que puede ser útil para usuarios no autenticados.
     * 
     * @return Información pública de la plataforma de e-learning
     */
    @GetMapping("/info")
    public String info() {
        return "Información pública de la plataforma de e-learning";
    }

    /**
     * Endpoint público para ver usuarios (sin información sensible).
     * 
     * Este endpoint permite ver la lista de usuarios registrados
     * sin necesidad de autenticación, pero oculta información sensible
     * como contraseñas y datos personales detallados.
     * 
     * @return Lista de usuarios con información pública
     */
    @GetMapping("/users")
    public Object getPublicUsers() {
        try {
            List<User> allUsers = userService.getAllUsers();
            
            // Filtrar información sensible y crear respuesta pública
            List<Object> publicUsers = allUsers.stream()
                .map(user -> {
                    return new Object() {
                        public final String email = user.getEmail();
                        public final String userName = user.getUserName();
                        public final String lastName = user.getLastName();
                        public final String role = user.getRole().toString();
                        public final boolean isActive = user.isActive();
                        public final String createdAt = user.getCreatedAt().toString();
                    };
                })
                .collect(Collectors.toList());
            
            return publicUsers;
            
        } catch (Exception e) {
            return "Error al obtener usuarios: " + e.getMessage();
        }
    }

    /**
     * Endpoint para ver estadísticas públicas del sistema.
     * 
     * @return Estadísticas generales de la plataforma
     */
    @GetMapping("/stats")
    public String getPublicStats() {
        try {
            List<User> allUsers = userService.getAllUsers();
            
            long totalUsers = allUsers.size();
            long activeUsers = allUsers.stream().filter(User::isActive).count();
            long adminUsers = allUsers.stream().filter(u -> u.getRole() == User.Role.ADMIN).count();
            long instructorUsers = allUsers.stream().filter(u -> u.getRole() == User.Role.INSTRUCTOR).count();
            long studentUsers = allUsers.stream().filter(u -> u.getRole() == User.Role.STUDENT).count();
            
            return String.format(
                "Estadísticas del Sistema:\n" +
                "- Total de usuarios: %d\n" +
                "- Usuarios activos: %d\n" +
                "- Administradores: %d\n" +
                "- Instructores: %d\n" +
                "- Estudiantes: %d\n" +
                "- Estado: Sistema funcionando correctamente",
                totalUsers, activeUsers, adminUsers, instructorUsers, studentUsers
            );
            
        } catch (Exception e) {
            return "Error al obtener estadísticas: " + e.getMessage();
        }
    }
}
