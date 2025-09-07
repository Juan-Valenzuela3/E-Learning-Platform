package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DTO para respuesta de autenticación exitosa.
 * Contiene el token JWT y información básica del usuario.
 * No expone datos sensibles como la contraseña.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponseDto {

    private String token;
    @Builder.Default
    private String type = "Bearer"; // Tipo de token por defecto
    private Long userId;
    private String userName;
    private String email;
    private User.Role role;
    private boolean isActive;

    
    public static LoginResponseDto fromUserAndToken(User user, String token) {
        return LoginResponseDto.builder()
                .token(token)
                .type("Bearer")
                .userId(user.getId())
                .userName(user.getUserName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .build();
    }
}
