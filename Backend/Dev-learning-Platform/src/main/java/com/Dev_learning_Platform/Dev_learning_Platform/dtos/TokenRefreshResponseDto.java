package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO (Data Transfer Object) para respuestas de renovación de tokens.
 * Se devuelve cuando se renueva exitosamente un access token usando un refresh token.
 * 
 * Contiene el nuevo access token y información adicional sobre la renovación.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenRefreshResponseDto {
    
    /**
     * El nuevo access token generado.
     * Este token reemplaza al anterior y tiene una nueva fecha de expiración.
     */
    private String accessToken;
    
    /**
     * El refresh token usado para la renovación.
     * Generalmente es el mismo token que se envió en la solicitud.
     */
    private String refreshToken;
    
    /**
     * Tipo de token. Siempre es "Bearer" para JWT tokens.
     */
    private String tokenType = "Bearer";
    
    /**
     * Tiempo de expiración del nuevo access token en milisegundos.
     * Por defecto es 1 hora (3600000 ms).
     */
    private long expiresIn;
    
    /**
     * Mensaje descriptivo sobre el resultado de la renovación.
     * Puede ser "Token renovado exitosamente" o un mensaje de error.
     */
    private String message;
}
