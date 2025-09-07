package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;

/**
 * Configuración Web para la aplicación E-Learning Platform.
 * 
 * Responsabilidades:
 * - Configuración de recursos estáticos (imágenes de perfil)
 * - Configuración de CORS para el frontend React
 * - Configuración de mapeo de URLs estáticas
 * 
 * @author Dev-Learning-Platform Team
 * @version 1.0
 * @since 2025-09-02
 */
@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${app.upload.profile-images.path:uploads/profiles}")
    private String profileImagesPath;
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;
    
    /**
     * Configura el manejo de recursos estáticos para servir imágenes de perfil.
     * Mapea la URL /uploads/profiles/** al directorio físico de imágenes.
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        log.info("Configurando servicio de archivos estáticos en: {}", profileImagesPath);
        
        registry.addResourceHandler("/uploads/profiles/**")
                .addResourceLocations("file:" + profileImagesPath + "/")
                .setCachePeriod(3600) // Cache por 1 hora para optimizar performance
                .resourceChain(true);
        
        log.info("Recursos estáticos configurados correctamente");
    }
    
    /**
     * Configura CORS para permitir requests desde el frontend React.
     * Necesario para la funcionalidad de carga de imágenes desde el frontend.
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        log.info("Configurando CORS para frontend: {}", frontendUrl);
        
        registry.addMapping("/api/**")
                .allowedOrigins(frontendUrl, "http://localhost:5173", "https://tu-dominio-vercel.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        
        // Configuración específica para endpoints de archivos
        registry.addMapping("/uploads/**")
                .allowedOrigins("*")
                .allowedMethods("GET")
                .maxAge(86400); // Cache por 24 horas
    }
}