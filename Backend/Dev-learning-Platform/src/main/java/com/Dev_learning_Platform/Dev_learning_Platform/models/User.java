package com.Dev_learning_Platform.Dev_learning_Platform.models;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Modelo de entidad para representar usuarios en la plataforma de e-learning.
 * 
 * Esta clase define la estructura de datos para los usuarios del sistema,
 * incluyendo información personal, credenciales de autenticación y roles.
 * 
 * Características principales:
 * - Información personal básica (nombre, apellido, email)
 * - Sistema de roles (STUDENT, INSTRUCTOR, ADMIN)
 * - Control de estado activo/inactivo
 * - Timestamps automáticos de creación y actualización
 * - Integración con Spring Security para autenticación
 * 
 * Relaciones:
 * - Un usuario puede tener múltiples refresh tokens
 * - Un usuario pertenece a un rol específico
 */
@Entity
@Table(name = "users")
@Getter
@Setter
public class User {
    /**
     * Identificador único auto-generado para el usuario
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nombre del usuario. Campo obligatorio con longitud máxima de 50 caracteres.
     */
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    /**
     * Apellido del usuario. Campo obligatorio con longitud máxima de 50 caracteres.
     */
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    /**
     * Email del usuario. Campo obligatorio, único y con longitud máxima de 100 caracteres.
     * Se usa como identificador único para autenticación.
     */
    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    /**
     * Contraseña encriptada del usuario. Campo obligatorio con longitud máxima de 100 caracteres.
     * Se almacena hasheada usando BCrypt para seguridad.
     */
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    /**
     * Rol del usuario en el sistema. Campo obligatorio.
     * Define los permisos y acceso del usuario en la plataforma.
     */
    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;
    
    /**
     * Indica si el usuario está activo en el sistema.
     * Por defecto es true. Los usuarios inactivos no pueden autenticarse.
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    /**
     * Timestamp de cuando se creó el usuario.
     * Se establece automáticamente antes de persistir.
     */
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    /**
     * Timestamp de la última actualización del usuario.
     * Se actualiza automáticamente en cada modificación.
     */
    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    /**
     * Enum que define los roles disponibles en la plataforma.
     * Cada rol tiene diferentes permisos y acceso a funcionalidades.
     */
    public enum Role {
        /**
         * Rol de estudiante. Puede acceder a cursos, materiales y evaluaciones.
         */
        STUDENT,
        
        /**
         * Rol de instructor. Puede crear y gestionar cursos, materiales y evaluaciones.
         */
        INSTRUCTOR,
        
        /**
         * Rol de administrador. Acceso completo al sistema, incluyendo gestión de usuarios.
         */
        ADMIN
    }

    /**
     * Método que se ejecuta automáticamente antes de persistir la entidad.
     * Establece los timestamps de creación y actualización con la fecha/hora actual.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    /**
     * Método que se ejecuta automáticamente antes de actualizar la entidad.
     * Actualiza el timestamp de modificación con la fecha/hora actual.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

}
