package com.Dev_learning_Platform.Dev_learning_Platform.config;

import com.Dev_learning_Platform.Dev_learning_Platform.middleware.RequestLoggingMiddleware;
import com.Dev_learning_Platform.Dev_learning_Platform.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuración principal de Spring Security para la aplicación.
 * * Esta clase configura:
 * - Autenticación basada en JWT (stateless)
 * - Autorización de endpoints
 * - Configuración de CORS
 * - Filtros de seguridad personalizados
 * - Encriptación de contraseñas
 * - Gestión de sesiones
 * * Características de seguridad:
 * - CSRF deshabilitado para APIs REST
 * - Sesiones stateless (sin estado)
 * - CORS configurado para desarrollo
 * - Filtros JWT y logging configurados
 * - Headers de seguridad configurados
 */
@Configuration // 1. Indica que esta clase es una fuente de beans de configuración de Spring.
@EnableWebSecurity // 2. Habilita la configuración de seguridad de Spring MVC.
public class SecurityConfig {

    // 3. Inyecta dependencias que serán usadas en la configuración.
    @Autowired // userDetailsService es un bean que carga los detalles del usuario.
    private UserDetailsService userDetailsService;

    @Autowired // jwtAuthenticationFilter es un filtro personalizado para JWT.
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired // requestLoggingMiddleware es un filtro personalizado para registrar peticiones.
    private RequestLoggingMiddleware requestLoggingMiddleware;

    // 4. Define el "SecurityFilterChain", el corazón de la configuración de seguridad.
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 5. Deshabilita la protección CSRF, común para APIs REST que no usan sesiones con estado.
            .csrf(csrf -> csrf.disable())
            // 6. Configura CORS, permitiendo peticiones de diferentes orígenes.
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 7. Configura la política de sesión como "STATELESS". Esto es clave para JWT, ya que el servidor no guarda el estado de la sesión.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 8. Configura las reglas de autorización para las URL.
            .authorizeHttpRequests(auth -> auth
                // Permite el acceso a cualquier URL que comience con /api/auth/** (ej. /login, /register).
                .requestMatchers("/api/auth/**").permitAll()
                // Permite el acceso a cualquier URL que comience con /api/public/** (recursos públicos).
                .requestMatchers("/api/public/**").permitAll()
                // Permite el acceso a la consola de H2 para desarrollo.
                .requestMatchers("/h2-console/**").permitAll()
                // Endpoints de administración - solo ADMIN
                .requestMatchers("/api/users/all").hasRole("ADMIN")
                .requestMatchers("/api/users/*/delete").hasRole("ADMIN")
                .requestMatchers("/api/users/*/role").hasRole("ADMIN")
                // Endpoints de gestión de usuarios - solo ADMIN
                .requestMatchers("/api/users/*").hasRole("ADMIN")
                // Endpoints de cursos - solo INSTRUCTOR y ADMIN
                .requestMatchers("/api/courses/**").hasAnyRole("INSTRUCTOR", "ADMIN")
                // Endpoints de perfil de usuario - cualquier usuario autenticado
                .requestMatchers("/api/users/me").authenticated()
                .requestMatchers("/api/users/profile").authenticated()
                // Cualquier otra petición debe estar autenticada.
                .anyRequest().authenticated()
            )
            // 9. Añade el filtro de logging *antes* del filtro JWT para registrar todas las peticiones
            .addFilterBefore(requestLoggingMiddleware, UsernamePasswordAuthenticationFilter.class)
            // 10. Añade el filtro de JWT *antes* del filtro estándar de autenticación de Spring Security.
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            // 11. Configura frameOptions para permitir que la consola de H2 se muestre en un iframe.
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.sameOrigin())
                .contentTypeOptions(contentTypeOptions -> contentTypeOptions.disable())
            );
        
        // 12. Construye y retorna la cadena de filtros de seguridad.
        return http.build();
    }

    // 13. Configura el proveedor de autenticación.
    @Bean
    @SuppressWarnings("deprecation")
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // Le dice al proveedor qué servicio de detalles de usuario usar.
        authProvider.setUserDetailsService(userDetailsService);
        // Le dice al proveedor qué codificador de contraseñas usar.
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // 14. Expone el "AuthenticationManager" como un bean, necesario para autenticar a los usuarios (ej. en un controlador de login).
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    // 15. Crea un bean para el codificador de contraseñas, usando el algoritmo BCrypt.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 16. Configura el "Cross-Origin Resource Sharing" (CORS).
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite peticiones desde cualquier origen (no recomendado para producción).
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        // Permite los métodos HTTP especificados.
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permite todas las cabeceras HTTP.
        configuration.setAllowedHeaders(Arrays.asList("*"));
        // Permite el envío de credenciales (cookies, cabeceras de autenticación).
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuración a todas las URL de la aplicación.
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
/*
 * Resumen del Flujo de Seguridad:
 * * 1. Entrada de la Petición: Una petición HTTP llega a la aplicación.
 * * 2. Filtro de Logging: La petición pasa primero por 'RequestLoggingMiddleware', que registra información de la solicitud (ej. URL, método, IP, User-Agent, headers, tiempo de respuesta).
 * * 3. Filtro de Autenticación JWT: Luego, el 'JwtAuthenticationFilter' intercepta la petición. Este filtro busca un token JWT en la cabecera 'Authorization'.
 * - Si un token válido es encontrado, extrae la identidad del usuario y la establece en el contexto de seguridad de Spring.
 * - Si no hay token o es inválido, la petición continúa sin un usuario autenticado.
 * * 4. Filtro de Autenticación de Spring: La petición llega al 'UsernamePasswordAuthenticationFilter', pero como la autenticación ya fue manejada por el filtro JWT, este filtro estándar es pasado por alto para las peticiones con token.
 * * 5. Autorización: Finalmente, Spring Security evalúa las reglas de 'authorizeHttpRequests'.
 * - Si la URL es una ruta pública (como '/api/auth/login'), el acceso es permitido inmediatamente.
 * - Para cualquier otra ruta, el acceso es permitido solo si el paso 3 estableció un usuario autenticado en el contexto de seguridad. Si no, se deniega con un error 401 (Unauthorized).
 */