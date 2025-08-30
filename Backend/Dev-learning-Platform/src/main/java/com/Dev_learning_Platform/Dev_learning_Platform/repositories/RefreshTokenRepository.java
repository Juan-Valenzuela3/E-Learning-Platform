package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import com.Dev_learning_Platform.Dev_learning_Platform.models.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones de base de datos relacionadas con Refresh Tokens.
 * Extiende JpaRepository para operaciones CRUD básicas y define queries personalizadas
 * para lógica de negocio específica de refresh tokens.
 * 
 * Funcionalidades principales:
 * - Búsqueda de tokens por usuario
 * - Validación de tokens activos
 * - Revocación masiva de tokens
 * - Limpieza automática de tokens expirados
 * - Conteo de tokens válidos por usuario
 */
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    
    /**
     * Busca un refresh token por su valor de token.
     * Útil para validar tokens durante el proceso de renovación.
     * 
     * @param token El valor del token a buscar
     * @return Optional que contiene el token si existe, vacío si no
     */
    Optional<RefreshToken> findByToken(String token);
    
    /**
     * Obtiene todos los refresh tokens de un usuario específico.
     * Incluye tokens válidos, expirados y revocados.
     * 
     * @param userId ID del usuario
     * @return Lista de todos los tokens del usuario
     */
    List<RefreshToken> findByUserId(Long userId);
    
    /**
     * Busca todos los tokens válidos (no expirados y no revocados) de un usuario.
     * Query optimizada que filtra en la base de datos para mejor rendimiento.
     * 
     * @param userId ID del usuario
     * @param now Timestamp actual para comparar con expiración
     * @return Lista de tokens válidos del usuario
     */
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.userId = :userId AND rt.isRevoked = false AND rt.expiryDate > :now")
    List<RefreshToken> findValidTokensByUserId(@Param("userId") Long userId, @Param("now") Timestamp now);
    
    /**
     * Revoca todos los tokens de un usuario específico.
     * Marca todos los tokens como revocados sin eliminarlos físicamente.
     * Útil para logout masivo o cambio de contraseña.
     * 
     * @param userId ID del usuario cuyos tokens se van a revocar
     */
    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.isRevoked = true WHERE rt.userId = :userId")
    void revokeAllTokensByUserId(@Param("userId") Long userId);
    
    /**
     * Elimina físicamente todos los tokens expirados de la base de datos.
     * Query de limpieza que se ejecuta periódicamente para mantener la BD optimizada.
     * 
     * @param now Timestamp actual para comparar con fechas de expiración
     */
    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiryDate < :now")
    void deleteExpiredTokens(@Param("now") Timestamp now);
    
    /**
     * Cuenta cuántos tokens válidos tiene un usuario actualmente.
     * Útil para implementar límites de tokens activos por usuario.
     * 
     * @param userId ID del usuario
     * @param now Timestamp actual para comparar con expiración
     * @return Número de tokens válidos del usuario
     */
    @Query("SELECT COUNT(rt) FROM RefreshToken rt WHERE rt.userId = :userId AND rt.isRevoked = false AND rt.expiryDate > :now")
    long countValidTokensByUserId(@Param("userId") Long userId, @Param("now") Timestamp now);
}
