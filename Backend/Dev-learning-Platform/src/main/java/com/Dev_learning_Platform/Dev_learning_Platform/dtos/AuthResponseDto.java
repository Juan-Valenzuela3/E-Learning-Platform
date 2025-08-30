package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para respuestas de autenticación.
 * Se usa para devolver información después de login, registro o validación de tokens.
 * 
 * Contiene tokens de acceso, información del usuario y mensajes de estado.
 */
@Data
@NoArgsConstructor
public class AuthResponseDto {
    
    /**
     * Token JWT de acceso que permite autenticarse en endpoints protegidos.
     * Tiene una duración corta (1 hora por defecto) por seguridad.
     */
    private String accessToken;
    
    /**
     * Token de renovación que permite obtener nuevos access tokens sin re-login.
     * Tiene una duración larga (7 días por defecto) y es único por sesión.
     */
    private String refreshToken;
    
    /**
     * Email del usuario autenticado.
     * Se usa como identificador único del usuario.
     */
    private String email;
    
    /**
     * Rol del usuario en el sistema.
     * Puede ser STUDENT, INSTRUCTOR o ADMIN.
     */
    private String role;
    
    /**
     * Mensaje descriptivo sobre el resultado de la operación.
     * Puede ser de éxito o error.
     */
    private String message;
    
    /**
     * Tipo de token. Siempre es "Bearer" para JWT tokens.
     */
    private String tokenType = "Bearer";
    
    /**
     * Tiempo de expiración del access token en milisegundos.
     * Por defecto es 1 hora (3600000 ms).
     */
    private long expiresIn = 3600000; // 1 hora en milisegundos

    /**
     * Constructor para respuestas de login exitoso con refresh token.
     * Se usa cuando el usuario se autentica correctamente.
     * 
     * @param accessToken Token JWT de acceso
     * @param refreshToken Token de renovación
     * @param email Email del usuario
     * @param role Rol del usuario
     * @param message Mensaje de éxito
     */
    public AuthResponseDto(String accessToken, String refreshToken, String email, String role, String message) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    /**
     * Constructor para respuestas sin refresh token.
     * Se usa para validación de tokens o registro de usuarios.
     * 
     * @param accessToken Token JWT de acceso (opcional)
     * @param email Email del usuario
     * @param role Rol del usuario
     * @param message Mensaje informativo
     */
    public AuthResponseDto(String accessToken, String email, String role, String message) {
        this.accessToken = accessToken;
        this.email = email;
        this.role = role;
        this.message = message;
    }

    /**
     * Constructor para respuestas de error.
     * Se usa cuando hay un problema en la autenticación.
     * 
     * @param message Mensaje de error descriptivo
     */
    public AuthResponseDto(String message) {
        this.message = message;
    }
}
