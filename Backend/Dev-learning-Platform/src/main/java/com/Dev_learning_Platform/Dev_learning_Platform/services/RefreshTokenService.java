package com.Dev_learning_Platform.Dev_learning_Platform.services;

import com.Dev_learning_Platform.Dev_learning_Platform.models.RefreshToken;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.RefreshTokenRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Servicio para gestionar Refresh Tokens.
 * 
 * Este servicio maneja toda la lógica de negocio relacionada con refresh tokens:
 * - Creación de nuevos refresh tokens
 * - Validación y verificación de tokens
 * - Revocación de tokens (individual y masiva)
 * - Limpieza automática de tokens expirados
 * - Control de límites de tokens por usuario
 * - Generación de nuevos access tokens
 * 
 * Características de seguridad:
 * - Límite configurable de tokens activos por usuario
 * - Rotación automática de tokens antiguos
 * - Tracking de IP y User-Agent
 * - Expiración configurable
 */
@Service
public class RefreshTokenService {

    /**
     * Repositorio para operaciones de base de datos con refresh tokens
     */
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    /**
     * Repositorio para operaciones de base de datos con usuarios
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Proveedor de tokens JWT para generar nuevos access tokens
     */
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Tiempo de expiración de refresh tokens en milisegundos.
     * Por defecto es 7 días (604800000 ms).
     * Configurable en application.properties
     */
    @Value("${jwt.refresh-expiration:604800000}") // 7 días por defecto
    private long refreshTokenExpirationMs;

    /**
     * Número máximo de refresh tokens activos permitidos por usuario.
     * Por defecto es 5 tokens.
     * Configurable en application.properties
     */
    @Value("${jwt.max-refresh-tokens-per-user:5}")
    private int maxRefreshTokensPerUser;

    /**
     * Crea un nuevo refresh token para un usuario específico.
     * 
     * Este método implementa varias medidas de seguridad:
     * 1. Limpia tokens expirados del usuario
     * 2. Verifica el límite de tokens activos
     * 3. Revoca el token más antiguo si se excede el límite
     * 4. Crea un nuevo token con información de auditoría
     * 
     * @param userId ID del usuario que solicita el token
     * @param ipAddress Dirección IP del cliente para auditoría
     * @param userAgent User-Agent del navegador para auditoría
     * @return RefreshToken creado y guardado en la base de datos
     */
    public RefreshToken createRefreshToken(Long userId, String ipAddress, String userAgent) {
        // Limpiar tokens expirados del usuario para mantener la BD limpia
        cleanupExpiredTokens(userId);

        // Verificar límite de tokens activos para prevenir abuso
        if (getActiveTokenCount(userId) >= maxRefreshTokensPerUser) {
            // Revocar el token más antiguo para hacer espacio al nuevo
            revokeOldestToken(userId);
        }

        // Crear nuevo refresh token con información completa
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(generateRefreshToken()); // Generar UUID único
        refreshToken.setUserId(userId);
        refreshToken.setExpiryDate(new Timestamp(System.currentTimeMillis() + refreshTokenExpirationMs));
        refreshToken.setIpAddress(ipAddress); // Para auditoría de seguridad
        refreshToken.setUserAgent(userAgent); // Para identificar dispositivo
        refreshToken.setRevoked(false); // Token activo por defecto

        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Busca un refresh token por su valor de token.
     * 
     * @param token El valor del token a buscar
     * @return Optional que contiene el token si existe
     */
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    /**
     * Verifica si un refresh token ha expirado.
     * Si ha expirado, lo elimina de la base de datos y lanza una excepción.
     * 
     * @param token El refresh token a verificar
     * @return El token si es válido
     * @throws RuntimeException si el token ha expirado
     */
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.isExpired()) {
            refreshTokenRepository.delete(token); // Eliminar token expirado
            throw new RuntimeException("Refresh token expirado. Por favor, inicie sesión nuevamente.");
        }
        return token;
    }

    /**
     * Revoca un refresh token específico marcándolo como revocado.
     * Los tokens revocados no pueden ser usados aunque no hayan expirado.
     * 
     * @param token El valor del token a revocar
     */
    public void revokeRefreshToken(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByToken(token);
        if (refreshToken.isPresent()) {
            RefreshToken rt = refreshToken.get();
            rt.setRevoked(true); // Marcar como revocado
            refreshTokenRepository.save(rt);
        }
    }

    /**
     * Revoca todos los refresh tokens de un usuario específico.
     * Útil para logout masivo o cambio de contraseña.
     * 
     * @param userId ID del usuario cuyos tokens se van a revocar
     */
    public void revokeAllUserTokens(Long userId) {
        refreshTokenRepository.revokeAllTokensByUserId(userId);
    }

    /**
     * Genera un nuevo access token usando un refresh token válido.
     * 
     * Este método:
     * 1. Busca el refresh token en la base de datos
     * 2. Verifica que no haya expirado
     * 3. Verifica que no haya sido revocado
     * 4. Obtiene el usuario asociado
     * 5. Genera un nuevo access token JWT
     * 
     * @param refreshToken El refresh token a usar para renovación
     * @return Nuevo access token JWT
     * @throws RuntimeException si el refresh token es inválido, expirado o revocado
     */
    public String generateNewAccessToken(String refreshToken) {
        Optional<RefreshToken> token = refreshTokenRepository.findByToken(refreshToken);
        if (token.isPresent()) {
            RefreshToken rt = verifyExpiration(token.get()); // Verificar expiración
            if (rt.isRevoked()) {
                throw new RuntimeException("Refresh token revocado");
            }
            
            // Obtener usuario y generar nuevo access token
            Optional<User> user = userRepository.findById(rt.getUserId());
            if (user.isPresent()) {
                return jwtTokenProvider.generateToken(user.get().getEmail());
            }
        }
        throw new RuntimeException("Refresh token inválido");
    }

    /**
     * Genera un refresh token único usando UUID.
     * Los UUIDs garantizan unicidad global y son seguros para uso criptográfico.
     * 
     * @return String con el UUID generado
     */
    private String generateRefreshToken() {
        return UUID.randomUUID().toString();
    }

    /**
     * Limpia todos los tokens expirados de un usuario específico.
     * Este método se ejecuta antes de crear nuevos tokens para mantener la BD limpia.
     * 
     * @param userId ID del usuario cuyos tokens se van a limpiar
     */
    private void cleanupExpiredTokens(Long userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        // Obtener todos los tokens del usuario y filtrar los expirados
        List<RefreshToken> expiredTokens = refreshTokenRepository.findByUserId(userId)
                .stream()
                .filter(token -> token.isExpired()) // Filtrar solo tokens expirados
                .toList();
        
        refreshTokenRepository.deleteAll(expiredTokens); // Eliminar tokens expirados
    }

    /**
     * Cuenta cuántos tokens activos tiene un usuario actualmente.
     * Se usa para verificar límites antes de crear nuevos tokens.
     * 
     * @param userId ID del usuario
     * @return Número de tokens activos del usuario
     */
    private long getActiveTokenCount(Long userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return refreshTokenRepository.countValidTokensByUserId(userId, now);
    }

    /**
     * Revoca el token más antiguo de un usuario.
     * Se usa cuando el usuario alcanza el límite de tokens activos.
     * Implementa la estrategia FIFO (First In, First Out).
     * 
     * @param userId ID del usuario
     */
    private void revokeOldestToken(Long userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        List<RefreshToken> validTokens = refreshTokenRepository.findValidTokensByUserId(userId, now);
        
        if (!validTokens.isEmpty()) {
            // Encontrar el token con la fecha de creación más antigua
            RefreshToken oldestToken = validTokens.stream()
                    .min((t1, t2) -> t1.getCreatedAt().compareTo(t2.getCreatedAt()))
                    .orElse(null);
            
            if (oldestToken != null) {
                oldestToken.setRevoked(true); // Marcar como revocado
                refreshTokenRepository.save(oldestToken);
            }
        }
    }

    /**
     * Tarea programada que limpia automáticamente todos los tokens expirados.
     * Se ejecuta cada 24 horas para mantener la base de datos optimizada.
     * 
     * Esta tarea:
     * - Elimina tokens expirados de todos los usuarios
     * - Mejora el rendimiento de las consultas
     * - Reduce el uso de almacenamiento
     */
    @Scheduled(fixedRate = 86400000) // Ejecutar cada 24 horas (86400000 ms)
    public void cleanupExpiredTokens() {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        refreshTokenRepository.deleteExpiredTokens(now);
    }

    public List<RefreshToken> getUserTokens(Long userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        return refreshTokenRepository.findValidTokensByUserId(userId, now);
    }

    public Map<String, Object> getUserTokenStats(Long userId) {
        Timestamp now = new Timestamp(System.currentTimeMillis());
        long activeTokens = refreshTokenRepository.countValidTokensByUserId(userId, now);
        List<RefreshToken> allTokens = refreshTokenRepository.findByUserId(userId);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeTokens", activeTokens);
        stats.put("totalTokens", allTokens.size());
        stats.put("expiredTokens", allTokens.stream().filter(token -> token.isExpired()).count());
        stats.put("revokedTokens", allTokens.stream().filter(token -> token.isRevoked()).count());
        stats.put("maxTokensAllowed", maxRefreshTokensPerUser);
        
        return stats;
    }
}
