package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthErrorResponseDto {

    private String message;
    private String error;
    private int status;
    private LocalDateTime timestamp;
    private String path;

 
    public static AuthErrorResponseDto invalidCredentials(String path) {
        return AuthErrorResponseDto.builder()
                .message("Credenciales inválidas")
                .error("INVALID_CREDENTIALS")
                .status(401)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }

  
    public static AuthErrorResponseDto userInactive(String path) {
        return AuthErrorResponseDto.builder()
                .message("Usuario inactivo")
                .error("USER_INACTIVE")
                .status(403)
                .timestamp(LocalDateTime.now())
                .path(path)
                .build();
    }

}
