package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.Data;

/**
 * DTO (Data Transfer Object) para solicitudes de renovación de tokens.
 * Se usa cuando el cliente quiere renovar su access token usando un refresh token.
 * 
 * Contiene el refresh token que se usará para generar un nuevo access token.
 */
@Data
public class TokenRefreshRequestDto {
    
    /**
     * El refresh token que se usará para renovar el access token.
     * Debe ser un token válido y no expirado.
     */
    private String refreshToken;
}
