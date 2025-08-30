package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.Data;

/**
 * DTO (Data Transfer Object) para solicitudes de login.
 * 
 * Este DTO se usa para recibir las credenciales de autenticación
 * desde el cliente durante el proceso de login.
 * 
 * Contiene:
 * - Email del usuario (usado como identificador único)
 * - Contraseña del usuario (en texto plano, se valida contra hash)
 * 
 * Seguridad:
 * - La contraseña se valida contra el hash almacenado en la base de datos
 * - No se almacena la contraseña en texto plano
 * - Se usa para autenticación con Spring Security
 */
@Data
public class LoginRequestDto {
    
    /**
     * Email del usuario que intenta autenticarse.
     * Debe ser un email válido y estar registrado en el sistema.
     */
    private String email;
    
    /**
     * Contraseña del usuario en texto plano.
     * Se valida contra el hash BCrypt almacenado en la base de datos.
     */
    private String password;
}
