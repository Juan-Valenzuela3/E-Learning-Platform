package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.AuthErrorResponseDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.LoginRequestDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.LoginResponseDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.TokenValidationResponseDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CustomUserDetailsService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.auth.JwtService;

import io.jsonwebtoken.JwtException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

   
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        log.info("Intento de login para usuario: {}", loginRequest.getEmail());

        try {
            // 1. Autenticar credenciales usando Spring Security
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

          
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            
           
            User user = userService.findByEmail(loginRequest.getEmail());
            
            if (user == null) {
                log.error("Inconsistencia: usuario autenticado pero no encontrado en DB: {}", 
                         loginRequest.getEmail());
                return buildErrorResponse(
                    AuthErrorResponseDto.invalidCredentials("/auth/login"),
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            }

            
            String jwtToken = jwtService.generateToken(userDetails);            
            LoginResponseDto response = LoginResponseDto.fromUserAndToken(user, jwtToken);            
            log.info("Login exitoso para usuario: {}", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            // Manejo específico para credenciales incorrectas
            log.warn("Credenciales inválidas para usuario: {}", loginRequest.getEmail());
            return buildErrorResponse(
                AuthErrorResponseDto.invalidCredentials("/auth/login"),
                HttpStatus.UNAUTHORIZED
            );
            
        } catch (DisabledException | UsernameNotFoundException e) {
            // Multi-catch para excepciones relacionadas con usuario inactivo/no encontrado
            log.warn("Usuario inactivo o no encontrado: {} - {}", loginRequest.getEmail(), e.getMessage());
            return buildErrorResponse(
                AuthErrorResponseDto.userInactive("/auth/login"),
                HttpStatus.FORBIDDEN
            );
            
        } catch (JwtException e) {
            // Manejo específico para errores de JWT
            log.error("Error al generar token JWT para usuario: {} - {}", 
                     loginRequest.getEmail(), e.getMessage());
            return buildErrorResponse(
                AuthErrorResponseDto.builder()
                    .message("Error al generar token de autenticación")
                    .error("JWT_GENERATION_ERROR")
                    .status(500)
                    .timestamp(java.time.LocalDateTime.now())
                    .path("/auth/login")
                    .build(),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
            
        } catch (RuntimeException e) {
            // Manejo para errores de runtime específicos
            log.error("Error de runtime durante autenticación para usuario: {} - {}", 
                     loginRequest.getEmail(), e.getMessage(), e);
            return buildErrorResponse(
                AuthErrorResponseDto.builder()
                    .message("Error interno del servidor")
                    .error("AUTHENTICATION_ERROR")
                    .status(500)
                    .timestamp(java.time.LocalDateTime.now())
                    .path("/auth/login")
                    .build(),
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    
    @GetMapping("/validate")
    public ResponseEntity<TokenValidationResponseDto> validateToken(@RequestParam String token) {
        log.debug("Validando token JWT");

        try {
            String username = jwtService.extractUsername(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            
            if (jwtService.validateToken(token, userDetails)) {
                log.debug("Token válido para usuario: {}", username);
                return ResponseEntity.ok(TokenValidationResponseDto.validToken(username));
            } else {
                log.debug("Token inválido o expirado");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(TokenValidationResponseDto.invalidToken("Token inválido o expirado"));
            }
            
        } catch (JwtException e) {
            // Manejo específico para errores de JWT
            log.warn("Error de JWT al validar token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(TokenValidationResponseDto.invalidToken("Token JWT inválido"));
                
        } catch (UsernameNotFoundException e) {
            // Usuario no encontrado durante validación
            log.warn("Usuario no encontrado durante validación de token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(TokenValidationResponseDto.invalidToken("Usuario no válido"));
                
        } catch (RuntimeException e) {
            // Otros errores de runtime
            log.warn("Error de runtime al validar token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(TokenValidationResponseDto.invalidToken("Token inválido"));
        }
    }

   
    private ResponseEntity<AuthErrorResponseDto> buildErrorResponse(
            AuthErrorResponseDto errorDto, 
            HttpStatus status) {
        return ResponseEntity.status(status).body(errorDto);
    }
}
