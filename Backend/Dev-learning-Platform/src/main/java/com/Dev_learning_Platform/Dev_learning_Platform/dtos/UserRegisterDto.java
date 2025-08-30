package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO (Data Transfer Object) para el registro de usuarios.
 * 
 * Este DTO se utiliza para transferir datos de registro de usuario desde el frontend
 * hacia el backend, encapsulando toda la información necesaria para crear un nuevo usuario.
 * 
 * Características:
 * - Contiene todos los campos necesarios para el registro
 * - Usa Lombok para generar getters y setters automáticamente
 * - Incluye método estático para convertir DTO a entidad User
 * - Valida y estructura los datos antes de crear el usuario
 */
@Getter
@Setter
public class UserRegisterDto {
    
    /**
     * Nombre del usuario. Campo obligatorio para el registro.
     */
    private String userName;
    
    /**
     * Apellido del usuario. Campo obligatorio para el registro.
     */
    private String lastName;
    
    /**
     * Email del usuario. Campo obligatorio y único para autenticación.
     */
    private String email;
    
    /**
     * Contraseña del usuario. Campo obligatorio (se encriptará en el servicio).
     */
    private String password;
    
    /**
     * Rol del usuario en el sistema. Puede ser STUDENT, INSTRUCTOR o ADMIN.
     * Si no se especifica, por defecto será STUDENT.
     */
    private User.Role role;

    /**
     * Método estático para convertir este DTO a una entidad User.
     * 
     * Este método crea una nueva instancia de User y copia todos los datos
     * del DTO a la entidad, preparándola para ser guardada en la base de datos.
     * 
     * @param dto El DTO con los datos del usuario a convertir
     * @return Una nueva instancia de User con los datos del DTO
     */
    public static User toEntity(UserRegisterDto dto) {
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }
}
