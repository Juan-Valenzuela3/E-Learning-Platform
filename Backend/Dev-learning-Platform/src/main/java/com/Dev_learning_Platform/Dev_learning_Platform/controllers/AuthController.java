package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.AuthResponseDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.LoginRequestDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.TokenRefreshRequestDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.TokenRefreshResponseDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.UserRegisterDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.security.JwtTokenProvider;
import com.Dev_learning_Platform.Dev_learning_Platform.services.RefreshTokenService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

/**
 * Controlador para manejar operaciones de autenticación y autorización.
 * 
 * Este controlador proporciona endpoints para:
 * - Login de usuarios con generación de tokens JWT y refresh tokens
 * - Registro de nuevos usuarios
 * - Renovación de access tokens usando refresh tokens
 * - Logout individual y masivo
 * - Validación de tokens
 * 
 * Todos los endpoints están bajo la ruta /api/auth/**
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    /**
     * Gestor de autenticación de Spring Security.
     * Se usa para validar credenciales de usuario durante el login.
     */
    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Servicio para operaciones relacionadas con usuarios.
     * Maneja registro, búsqueda y gestión de usuarios.
     */
    @Autowired
    private UserService userService;

    /**
     * Proveedor de tokens JWT.
     * Genera y valida tokens JWT para autenticación.
     */
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Servicio para gestión de refresh tokens.
     * Maneja creación, validación y revocación de refresh tokens.
     */
    @Autowired
    private RefreshTokenService refreshTokenService;

    /**
     * Endpoint para autenticación de usuarios (login).
     * 
     * Este endpoint implementa el flujo completo de autenticación:
     * 1. Valida las credenciales del usuario usando Spring Security AuthenticationManager
     * 2. Genera un access token JWT con información de autenticación
     * 3. Crea un refresh token único con información de auditoría (IP, User-Agent)
     * 4. Establece la autenticación en el contexto de seguridad
     * 5. Devuelve ambos tokens junto con información del usuario
     * 
     * Características de seguridad:
     * - Validación robusta de credenciales
     * - Generación segura de tokens JWT
     * - Auditoría completa de sesiones
     * - Manejo de errores sin exponer información sensible
     * 
     * @param loginRequest DTO con email y contraseña del usuario
     * @param request Objeto HttpServletRequest para obtener información del cliente (IP, User-Agent)
     * @return ResponseEntity con tokens JWT y refresh token, o error si las credenciales son inválidas
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequest, 
                                                HttpServletRequest request) {
        try {
            // Autenticar usuario usando Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            // Establecer autenticación en el contexto de seguridad
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            // Obtener información completa del usuario
            User user = userService.findByEmail(loginRequest.getEmail());
            
            // Generar access token JWT con información de autenticación
            String accessToken = jwtTokenProvider.generateToken(authentication);
            
            // Generar refresh token con información de auditoría
            String clientIP = getClientIP(request);
            String userAgent = request.getHeader("User-Agent");
            var refreshToken = refreshTokenService.createRefreshToken(user.getId(), clientIP, userAgent);
            
            // Devolver respuesta exitosa con ambos tokens
            return ResponseEntity.ok(new AuthResponseDto(
                accessToken,
                refreshToken.getToken(),
                user.getEmail(),
                user.getRole().name(),
                "Login exitoso"
            ));
        } catch (Exception e) {
            // Devolver error si las credenciales son inválidas
            return ResponseEntity.badRequest().body(new AuthResponseDto(
                null,
                null,
                null,
                "Credenciales inválidas"
            ));
        }
    }

    /**
     * Endpoint para registro de nuevos usuarios.
     * 
     * Este endpoint permite a nuevos usuarios crear una cuenta en la plataforma:
     * 1. Valida los datos de registro (email único, campos obligatorios)
     * 2. Encripta la contraseña usando BCrypt
     * 3. Asigna el rol por defecto (STUDENT) si no se especifica
     * 4. Guarda el usuario en la base de datos
     * 5. Devuelve confirmación del registro exitoso
     * 
     * Características de seguridad:
     * - Validación de email único
     * - Encriptación automática de contraseñas
     * - Asignación segura de roles
     * - Manejo de errores de validación
     * 
     * @param registerDto DTO con datos de registro del usuario (nombre, apellido, email, contraseña, rol)
     * @return ResponseEntity con confirmación del registro o error si falla
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDto> register(@RequestBody UserRegisterDto registerDto) {
        try {
            User user = userService.registerUser(registerDto);
            
            return ResponseEntity.ok(new AuthResponseDto(
                null,
                user.getEmail(),
                user.getRole().name(),
                "Usuario registrado exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponseDto(
                null,
                null,
                null,
                "Error al registrar usuario: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Endpoint de autenticación funcionando correctamente");
    }



    /**
     * Endpoint para validar tokens JWT.
     * 
     * Este endpoint permite verificar si un token JWT es válido y no ha expirado:
     * 1. Extrae el token del header Authorization (formato Bearer)
     * 2. Valida la firma y estructura del token JWT
     * 3. Verifica que el token no haya expirado
     * 4. Obtiene la información del usuario desde la base de datos
     * 5. Devuelve información del usuario si el token es válido
     * 
     * Características de seguridad:
     * - Validación completa de tokens JWT
     * - Verificación de expiración
     * - Extracción segura de información del usuario
     * - Manejo robusto de errores de validación
     * 
     * @param authHeader Header de autorización con el token Bearer
     * @return ResponseEntity con información del usuario si el token es válido, o error si es inválido
     */
    @PostMapping("/validate")
    public ResponseEntity<AuthResponseDto> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                
                if (jwtTokenProvider.validateToken(token) && !jwtTokenProvider.isTokenExpired(token)) {
                    String email = jwtTokenProvider.getEmailFromToken(token);
                    User user = userService.findByEmail(email);
                    
                    return ResponseEntity.ok(new AuthResponseDto(
                        token,
                        user.getEmail(),
                        user.getRole().name(),
                        "Token válido"
                    ));
                }
            }
            
            return ResponseEntity.badRequest().body(new AuthResponseDto(
                null,
                null,
                null,
                "Token inválido o expirado"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new AuthResponseDto(
                null,
                null,
                null,
                "Error al validar token: " + e.getMessage()
            ));
        }
    }

    /**
     * Endpoint para renovar access tokens usando refresh tokens.
     * 
     * Este endpoint permite obtener un nuevo access token sin necesidad de re-autenticación:
     * 1. Recibe un refresh token válido del cliente
     * 2. Valida que el refresh token no haya expirado ni sido revocado
     * 3. Obtiene la información del usuario asociado al refresh token
     * 4. Genera un nuevo access token JWT con nueva fecha de expiración
     * 5. Devuelve el nuevo access token manteniendo el mismo refresh token
     * 
     * Características de seguridad:
     * - Validación completa de refresh tokens
     * - Verificación de expiración y revocación
     * - Generación segura de nuevos access tokens
     * - Mantenimiento de la sesión del usuario
     * 
     * @param request DTO con el refresh token a usar para renovación
     * @return ResponseEntity con el nuevo access token o error si el refresh token es inválido
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponseDto> refreshToken(@RequestBody TokenRefreshRequestDto request) {
        try {
            String newAccessToken = refreshTokenService.generateNewAccessToken(request.getRefreshToken());
            
            return ResponseEntity.ok(new TokenRefreshResponseDto(
                newAccessToken,
                request.getRefreshToken(), // Mantener el mismo refresh token
                "Bearer",
                3600000, // 1 hora en milisegundos
                "Token renovado exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TokenRefreshResponseDto(
                null,
                null,
                null,
                0,
                "Error al renovar token: " + e.getMessage()
            ));
        }
    }

    /**
     * Endpoint para logout individual (revocar un refresh token específico).
     * 
     * Este endpoint permite al usuario cerrar sesión en un dispositivo específico:
     * 1. Recibe el refresh token del dispositivo a cerrar sesión
     * 2. Revoca el refresh token específico marcándolo como inválido
     * 3. El access token asociado seguirá funcionando hasta su expiración natural
     * 4. Confirma el logout exitoso del dispositivo
     * 
     * Características de seguridad:
     * - Revocación segura de refresh tokens
     * - Mantenimiento de sesiones en otros dispositivos
     * - Auditoría de logout por dispositivo
     * 
     * @param authHeader Header de autorización con el access token (para validación)
     * @param request DTO con el refresh token a revocar
     * @return ResponseEntity con confirmación del logout o error si falla
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody TokenRefreshRequestDto request) {
        try {
            // Revocar refresh token específico
            refreshTokenService.revokeRefreshToken(request.getRefreshToken());
            
            return ResponseEntity.ok("Logout exitoso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en logout: " + e.getMessage());
        }
    }

    /**
     * Endpoint para logout masivo (revocar todos los refresh tokens del usuario).
     * 
     * Este endpoint permite al usuario cerrar sesión en todos los dispositivos:
     * 1. Extrae la información del usuario desde el access token JWT
     * 2. Revoca todos los refresh tokens activos del usuario
     * 3. Fuerza el logout en todos los dispositivos
     * 4. Confirma el logout masivo exitoso
     * 
     * Características de seguridad:
     * - Revocación masiva de refresh tokens
     * - Logout completo en todos los dispositivos
     * - Útil para cambio de contraseña o sospecha de compromiso
     * 
     * @param authHeader Header de autorización con el access token JWT
     * @return ResponseEntity con confirmación del logout masivo o error si falla
     */
    @PostMapping("/logout-all")
    public ResponseEntity<String> logoutAll(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extraer email del token JWT
            String token = authHeader.substring(7);
            String email = jwtTokenProvider.getEmailFromToken(token);
            User user = userService.findByEmail(email);
            
            // Revocar todos los tokens del usuario
            refreshTokenService.revokeAllUserTokens(user.getId());
            
            return ResponseEntity.ok("Logout de todos los dispositivos exitoso");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error en logout: " + e.getMessage());
        }
    }

    /**
     * Método auxiliar para obtener la dirección IP real del cliente.
     * 
     * Este método maneja diferentes escenarios de proxy y balanceadores de carga:
     * 1. Verifica el header X-Forwarded-For (usado por proxies y CDNs)
     * 2. Verifica el header X-Real-IP (usado por algunos balanceadores)
     * 3. Usa la IP remota directa como fallback
     * 
     * Características:
     * - Manejo de múltiples headers de IP
     * - Filtrado de valores "unknown"
     * - Extracción de la primera IP en listas (X-Forwarded-For)
     * - Fallback seguro a IP remota
     * 
     * @param request Objeto HttpServletRequest para acceder a headers
     * @return String con la dirección IP real del cliente
     */
    private String getClientIP(HttpServletRequest request) {
        // Verificar X-Forwarded-For (proxy/CDN)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0]; // Tomar la primera IP de la lista
        }
        
        // Verificar X-Real-IP (balanceador de carga)
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty() && !"unknown".equalsIgnoreCase(xRealIP)) {
            return xRealIP;
        }
        
        // Fallback a IP remota directa
        return request.getRemoteAddr();
    }
}
