package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

/**
 * Configuración centralizada para la funcionalidad de carga de archivos.
 * 
 * Permite configurar todos los parámetros relacionados con archivos
 * desde application.properties de forma type-safe.
 * 
 * @author Dev-Learning-Platform Team
 * @version 1.0
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "app.upload")
public class FileUploadConfig {
    
    /**
     * Configuración específica para imágenes de perfil.
     */
    private ProfileImages profileImages = new ProfileImages();
    
    @Data
    public static class ProfileImages {
        /**
         * Ruta donde se almacenan las imágenes de perfil.
         */
        private String path = "uploads/profiles";
        
        /**
         * URL base para acceder a las imágenes.
         */
        private String baseUrl = "http://localhost:8080/uploads/profiles";
        
        /**
         * Tamaño máximo permitido para archivos (en bytes).
         */
        private long maxFileSize = 5 * 1024 * 1024; // 5MB
        
        /**
         * Extensiones de archivo permitidas.
         */
        private String[] allowedExtensions = {"jpg", "jpeg", "png", "gif", "webp", "svg"};
        
        /**
         * Tipos MIME permitidos.
         */
        private String[] allowedMimeTypes = {
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
        };
    }
}
