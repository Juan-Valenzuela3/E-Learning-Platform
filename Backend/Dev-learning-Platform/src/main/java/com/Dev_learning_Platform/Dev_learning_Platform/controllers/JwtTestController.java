package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import com.Dev_learning_Platform.Dev_learning_Platform.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para pruebas y testing del sistema JWT.
 * 
 * Este controlador proporciona endpoints para:
 * - Probar y validar tokens JWT
 * - Obtener información detallada de tokens
 * - Verificar el estado de autenticación
 * - Probar renovación de tokens
 * - Acceder a datos protegidos
 * 
 * Características:
 * - Endpoints para debugging y desarrollo
 * - Información detallada de tokens JWT
 * - Validación de autenticación
 * - Pruebas de funcionalidad de seguridad
 * 
 * Uso:
 * - Desarrollo y testing
 * - Debugging de problemas de autenticación
 * - Verificación de configuración JWT
 * - Pruebas de endpoints protegidos
 * 
 *   NOTA: Este controlador es principalmente para desarrollo y testing.
 * En producción, algunos endpoints podrían ser removidos o restringidos.
 */
@RestController
@RequestMapping("/api/jwt-test")
@CrossOrigin(origins = "*")
public class JwtTestController {

    /**
     * Proveedor de tokens JWT para validación y generación
     */
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Endpoint para obtener información detallada de un token JWT.
     * 
     * Este endpoint analiza un token JWT y proporciona información completa sobre:
     * - Validez del token
     * - Estado de expiración
     * - Email del usuario
     * - Fecha de expiración
     * - Estado de autenticación
     * - Autoridades del usuario
     * 
     * Útil para debugging y verificación de tokens durante desarrollo.
     * 
     * @param authHeader Header de autorización con el token Bearer
     * @return ResponseEntity con información detallada del token
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getJwtInfo(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Extraer token del header Bearer
                String token = authHeader.substring(7);
                
                // Analizar información del token JWT
                response.put("tokenValid", jwtTokenProvider.validateToken(token));
                response.put("tokenExpired", jwtTokenProvider.isTokenExpired(token));
                response.put("email", jwtTokenProvider.getEmailFromToken(token));
                response.put("expiration", jwtTokenProvider.getExpirationDateFromToken(token));
                
                // Obtener información de autenticación del contexto
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                response.put("authenticated", auth != null && auth.isAuthenticated());
                response.put("principal", auth != null ? auth.getName() : "No autenticado");
                response.put("authorities", auth != null ? auth.getAuthorities() : "Sin autoridades");
                
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "No se proporcionó token Bearer");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("error", "Error al procesar token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Endpoint para acceder a datos protegidos que requieren autenticación JWT.
     * 
     * Este endpoint demuestra cómo acceder a datos protegidos usando
     * la información del usuario autenticado desde el contexto de seguridad.
     * 
     * @return ResponseEntity con datos protegidos del usuario autenticado
     */
    @GetMapping("/protected-data")
    public ResponseEntity<Map<String, Object>> getProtectedData() {
        // Obtener información del usuario autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        
        // Construir respuesta con datos protegidos
        Map<String, Object> data = new HashMap<>();
        data.put("message", "Datos protegidos accesibles solo con JWT válido");
        data.put("user", auth.getName());
        data.put("authorities", auth.getAuthorities());
        data.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(data);
    }

    /**
     * Endpoint para probar la renovación de tokens JWT.
     * 
     * Este endpoint toma un token JWT válido y genera un nuevo token
     * con la misma información pero nueva fecha de expiración.
     * Útil para probar la funcionalidad de renovación de tokens.
     * 
     * @param authHeader Header de autorización con el token Bearer a renovar
     * @return ResponseEntity con el nuevo token generado
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                // Extraer token del header Bearer
                String oldToken = authHeader.substring(7);
                
                // Validar token original antes de renovar
                if (jwtTokenProvider.validateToken(oldToken)) {
                    // Extraer email y generar nuevo token
                    String email = jwtTokenProvider.getEmailFromToken(oldToken);
                    String newToken = jwtTokenProvider.generateToken(email);
                    
                    // Construir respuesta con nuevo token
                    response.put("newToken", newToken);
                    response.put("message", "Token renovado exitosamente");
                    response.put("email", email);
                    
                    return ResponseEntity.ok(response);
                } else {
                    response.put("error", "Token original inválido");
                    return ResponseEntity.badRequest().body(response);
                }
            } else {
                response.put("error", "No se proporcionó token Bearer");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("error", "Error al renovar token: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
