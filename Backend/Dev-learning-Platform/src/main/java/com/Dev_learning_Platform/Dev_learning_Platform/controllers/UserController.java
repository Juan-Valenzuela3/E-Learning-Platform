package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

/**
 * Controlador para operaciones relacionadas con usuarios autenticados.
 * 
 * Este controlador proporciona endpoints para:
 * - Obtener información del usuario autenticado actual
 * - Acceder al perfil del usuario
 * - Operaciones de gestión de perfil de usuario
 * 
 * Características:
 * - Todos los endpoints requieren autenticación JWT válida
 * - Obtiene información del usuario desde el contexto de seguridad
 * - Implementa medidas de seguridad (no retorna contraseñas)
 * - Endpoints protegidos bajo /api/users/**
 * 
 * Seguridad:
 * - Validación automática de tokens JWT
 * - Filtrado de información sensible
 * - Acceso solo a datos del usuario autenticado
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    /**
     * Servicio para operaciones relacionadas con usuarios
     */
    @Autowired
    private UserService userService;

    /**
     * Endpoint para obtener información del usuario autenticado actual.
     * 
     * Este endpoint:
     * 1. Obtiene el usuario autenticado desde el contexto de seguridad
     * 2. Busca la información completa del usuario en la base de datos
     * 3. Filtra información sensible (contraseña) antes de retornar
     * 4. Devuelve los datos del usuario de forma segura
     * 
     * @return ResponseEntity con la información del usuario (sin contraseña)
     */
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        // Obtener usuario autenticado desde el contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        
        // Buscar información completa del usuario
        User user = userService.findByEmail(email);
        
        // Medida de seguridad: no retornar la contraseña
        user.setPassword(null);
        
        return ResponseEntity.ok(user);
    }

    /**
     * Endpoint para obtener información básica del perfil del usuario.
     * 
     * Este endpoint proporciona información básica del usuario autenticado
     * sin acceder a la base de datos, solo usando el contexto de seguridad.
     * 
     * @return ResponseEntity con información básica del perfil
     */
    @GetMapping("/profile")
    public ResponseEntity<String> getProfile() {
        // Obtener información básica desde el contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok("Perfil del usuario: " + authentication.getName());
    }

    /**
     * Endpoint para obtener todos los usuarios registrados.
     * 
     * Este endpoint:
     * 1. Requiere autenticación JWT válida
     * 2. Retorna lista de todos los usuarios
     * 3. Filtra información sensible (contraseñas)
     * 
     * @return ResponseEntity con lista de usuarios
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        try {
            return ResponseEntity.ok(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener usuarios: " + e.getMessage());
        }
    }

    /**
     * Endpoint para eliminar un usuario por ID.
     * 
     * Este endpoint:
     * 1. Requiere autenticación JWT válida
     * 2. Solo los administradores pueden eliminar usuarios
     * 3. No permite eliminar la propia cuenta del admin
     * 
     * @param userId ID del usuario a eliminar
     * @return ResponseEntity con mensaje de confirmación
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        try {
            // Obtener usuario autenticado desde el contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User adminUser = userService.findByEmail(email);
            
            // Eliminar usuario
            userService.deleteUser(userId, adminUser);
            
            return ResponseEntity.ok("Usuario eliminado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al eliminar usuario: " + e.getMessage());
        }
    }

    /**
     * Endpoint para cambiar el rol de un usuario.
     * 
     * Este endpoint:
     * 1. Requiere autenticación JWT válida
     * 2. Solo los administradores pueden cambiar roles
     * 3. No permite cambiar el propio rol del admin
     * 4. Permite cambiar entre STUDENT, INSTRUCTOR, ADMIN
     * 
     * @param userId ID del usuario cuyo rol se va a cambiar
     * @param roleRequest Objeto con el nuevo rol
     * @return ResponseEntity con el usuario actualizado
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<?> changeUserRole(@PathVariable Long userId, @RequestBody RoleChangeRequest roleRequest) {
        try {
            // Obtener usuario autenticado desde el contexto de seguridad
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User adminUser = userService.findByEmail(email);
            
            // Cambiar rol del usuario
            User updatedUser = userService.changeUserRole(userId, roleRequest.getRole(), adminUser);
            
            // No retornar la contraseña por seguridad
            updatedUser.setPassword(null);
            
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar rol: " + e.getMessage());
        }
    }

    /**
     * Clase interna para manejar la solicitud de cambio de rol
     */
    public static class RoleChangeRequest {
        private User.Role role;

        public User.Role getRole() {
            return role;
        }

        public void setRole(User.Role role) {
            this.role = role;
        }
    }
}
