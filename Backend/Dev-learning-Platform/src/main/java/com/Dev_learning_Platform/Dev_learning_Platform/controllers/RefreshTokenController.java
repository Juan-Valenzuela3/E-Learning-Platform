package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import com.Dev_learning_Platform.Dev_learning_Platform.models.RefreshToken;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.RefreshTokenService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador para administrar y monitorear refresh tokens.
 * 
 * Este controlador proporciona endpoints para:
 * - Ver tokens activos del usuario autenticado
 * - Revocar tokens específicos
 * - Revocar todos los tokens del usuario
 * - Obtener estadísticas de uso de tokens
 * 
 * Todos los endpoints requieren autenticación JWT válida.
 * Los endpoints están bajo la ruta /api/refresh-tokens/**
 */
@RestController
@RequestMapping("/api/refresh-tokens")
@CrossOrigin(origins = "*")
public class RefreshTokenController {

    /**
     * Servicio para gestión de refresh tokens.
     * Maneja operaciones CRUD y lógica de negocio de refresh tokens.
     */
    @Autowired
    private RefreshTokenService refreshTokenService;

    /**
     * Servicio para operaciones relacionadas con usuarios.
     * Se usa para obtener información del usuario autenticado.
     */
    @Autowired
    private UserService userService;

    /**
     * Endpoint para obtener todos los tokens activos del usuario autenticado.
     * 
     * Este endpoint:
     * 1. Obtiene el usuario autenticado desde el contexto de seguridad
     * 2. Busca todos los tokens válidos del usuario
     * 3. Devuelve información detallada incluyendo IP, User-Agent y fechas
     * 
     * Útil para que el usuario vea en qué dispositivos está logueado.
     * 
     * @return ResponseEntity con lista de tokens activos y estadísticas
     */
    @GetMapping("/my-tokens")
    public ResponseEntity<Map<String, Object>> getMyTokens() {
        try {
            // Obtener usuario autenticado desde el contexto de seguridad
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.findByEmail(email);

            // Obtener todos los tokens activos del usuario
            List<RefreshToken> tokens = refreshTokenService.getUserTokens(user.getId());
            
            // Construir respuesta con información detallada
            Map<String, Object> response = new HashMap<>();
            response.put("userId", user.getId());
            response.put("email", user.getEmail());
            response.put("activeTokens", tokens.size());
            response.put("tokens", tokens); // Lista completa de tokens con detalles
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Manejar errores y devolver mensaje descriptivo
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener tokens: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/revoke/{tokenId}")
    public ResponseEntity<String> revokeToken(@PathVariable String tokenId) {
        try {
            refreshTokenService.revokeRefreshToken(tokenId);
            return ResponseEntity.ok("Token revocado exitosamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al revocar token: " + e.getMessage());
        }
    }

    @DeleteMapping("/revoke-all")
    public ResponseEntity<String> revokeAllMyTokens() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.findByEmail(email);

            refreshTokenService.revokeAllUserTokens(user.getId());
            return ResponseEntity.ok("Todos los tokens han sido revocados");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al revocar tokens: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTokenStats() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            User user = userService.findByEmail(email);

            Map<String, Object> stats = refreshTokenService.getUserTokenStats(user.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
