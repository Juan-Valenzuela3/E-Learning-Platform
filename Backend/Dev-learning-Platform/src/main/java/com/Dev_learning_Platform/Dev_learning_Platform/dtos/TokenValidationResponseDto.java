package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para respuesta de validación de token JWT.
 * Elimina la necesidad de strings JSON manuales (Clean Code).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenValidationResponseDto {
    
    private boolean valid;
    private String username;
    private String message;
    
    public static TokenValidationResponseDto validToken(String username) {
        return TokenValidationResponseDto.builder()
                .valid(true)
                .username(username)
                .build();
    }
    
    public static TokenValidationResponseDto invalidToken(String message) {
        return TokenValidationResponseDto.builder()
                .valid(false)
                .message(message)
                .build();
    }
}
