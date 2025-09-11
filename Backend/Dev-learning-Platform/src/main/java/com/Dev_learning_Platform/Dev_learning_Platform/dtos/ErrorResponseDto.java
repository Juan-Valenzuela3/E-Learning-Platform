package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para respuestas de error standarizadas.
 * Implementa Clean Code para manejo consistente de errores.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponseDto {
    
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    private List<String> errors; // Para errores de validación múltiples
    
    /**
     * Crea respuesta de error simple.
     */
    public static ErrorResponseDto simple(String error, String message, String path) {
        return ErrorResponseDto.builder()
                .error(error)
                .message(message)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }
    
    /**
     * Crea respuesta de error con múltiples validaciones.
     */
    public static ErrorResponseDto validation(List<String> errors, String path) {
        return ErrorResponseDto.builder()
                .error("VALIDATION_ERROR")
                .message("Errores de validación en los datos enviados")
                .timestamp(LocalDateTime.now())
                .path(path)
                .errors(errors)
                .build();
    }
}
