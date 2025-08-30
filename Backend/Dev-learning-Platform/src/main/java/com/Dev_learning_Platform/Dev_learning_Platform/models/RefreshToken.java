package com.Dev_learning_Platform.Dev_learning_Platform.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.Instant;

/**
 * Modelo de entidad para almacenar Refresh Tokens en la base de datos.
 * Los refresh tokens permiten renovar access tokens sin necesidad de re-autenticación.
 * 
 * Características principales:
 * - Tokens únicos generados con UUID
 * - Expiración configurable (por defecto 7 días)
 * - Capacidad de revocación manual
 * - Tracking de IP y User-Agent para auditoría
 * - Timestamps automáticos de creación
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
public class RefreshToken {
    
    /**
     * Identificador único auto-generado para el refresh token
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Token único generado con UUID. Se usa para renovar access tokens.
     * Debe ser único en toda la base de datos.
     */
    @Column(name = "token", nullable = false, unique = true)
    private String token;

    /**
     * ID del usuario propietario del refresh token.
     * Relación con la tabla users.
     */
    @Column(name = "user_id", nullable = false)
    private Long userId;

    /**
     * Fecha y hora de expiración del refresh token.
     * Después de esta fecha, el token no puede ser usado.
     */
    @Column(name = "expiry_date", nullable = false)
    private Timestamp expiryDate;

    /**
     * Indica si el token ha sido revocado manualmente.
     * Los tokens revocados no pueden ser usados aunque no hayan expirado.
     */
    @Column(name = "is_revoked", nullable = false)
    private boolean isRevoked = false;

    /**
     * Timestamp automático de cuando se creó el token.
     * Se establece automáticamente antes de persistir.
     */
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    /**
     * Dirección IP del cliente que solicitó el token.
     * Útil para auditoría y detección de uso sospechoso.
     */
    @Column(name = "ip_address")
    private String ipAddress;

    /**
     * User-Agent del navegador/dispositivo que solicitó el token.
     * Ayuda a identificar el dispositivo y navegador usado.
     */
    @Column(name = "user_agent")
    private String userAgent;

    /**
     * Método que se ejecuta automáticamente antes de persistir la entidad.
     * Establece el timestamp de creación con la fecha/hora actual.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
    }

    /**
     * Verifica si el refresh token ha expirado.
     * Compara la fecha actual con la fecha de expiración.
     * 
     * @return true si el token ha expirado, false en caso contrario
     */
    public boolean isExpired() {
        return new Timestamp(System.currentTimeMillis()).after(expiryDate);
    }

    /**
     * Verifica si el refresh token es válido para uso.
     * Un token es válido si no ha expirado y no ha sido revocado.
     * 
     * @return true si el token es válido, false en caso contrario
     */
    public boolean isValid() {
        return !isExpired() && !isRevoked;
    }
}
