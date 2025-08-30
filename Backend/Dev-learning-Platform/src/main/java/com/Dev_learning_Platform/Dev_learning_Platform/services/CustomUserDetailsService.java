package com.Dev_learning_Platform.Dev_learning_Platform.services;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Servicio personalizado para cargar detalles de usuario para Spring Security.
 * 
 * Este servicio implementa UserDetailsService de Spring Security y es responsable de:
 * - Cargar usuarios desde la base de datos durante la autenticación
 * - Convertir usuarios de la aplicación a UserDetails de Spring Security
 * - Configurar autoridades (roles) para autorización
 * - Manejar el estado de la cuenta (activa/inactiva)
 * 
 * Características principales:
 * - Usa email como identificador de usuario
 * - Convierte roles de la aplicación a autoridades de Spring Security
 * - Controla el estado activo/inactivo del usuario
 * - Integración completa con el sistema de autenticación JWT
 * 
 * Integración:
 * - Con JwtAuthenticationFilter para autenticación
 * - Con SecurityConfig para configuración de seguridad
 * - Con UserRepository para acceso a datos
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    /**
     * Repositorio para acceder a datos de usuarios en la base de datos
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Carga los detalles de un usuario por su email para Spring Security.
     * 
     * Este método es llamado automáticamente por Spring Security durante el proceso
     * de autenticación. Convierte un usuario de la aplicación a un UserDetails
     * que Spring Security puede usar para autenticación y autorización.
     * 
     * El método:
     * 1. Busca el usuario por email en la base de datos
     * 2. Convierte el rol de la aplicación a una autoridad de Spring Security
     * 3. Configura el estado de la cuenta (activa/inactiva)
     * 4. Construye un UserDetails con toda la información necesaria
     * 
     * @param email El email del usuario a cargar (usado como username)
     * @return UserDetails con información completa del usuario para Spring Security
     * @throws UsernameNotFoundException si el usuario no existe en la base de datos
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscar usuario por email en la base de datos
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));

        // Construir UserDetails para Spring Security
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail()) // Usar email como username
                .password(user.getPassword()) // Contraseña encriptada
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))) // Convertir rol a autoridad
                .disabled(!user.isActive()) // Deshabilitar si el usuario no está activo
                .accountExpired(false) // Cuenta no expirada
                .credentialsExpired(false) // Credenciales no expiradas
                .accountLocked(false) // Cuenta no bloqueada
                .build();
    }
}
