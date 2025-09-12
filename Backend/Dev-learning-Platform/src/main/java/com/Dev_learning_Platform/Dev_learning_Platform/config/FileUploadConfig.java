package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;


@Data
@Configuration
@ConfigurationProperties(prefix = "app.upload")
public class FileUploadConfig {
   
    private ProfileImages profileImages = new ProfileImages();
    
    @Data
    public static class ProfileImages {
        private String path = "uploads/profiles";        
        private String baseUrl;      
        private long maxFileSize = 5 * 1024 * 1024; // 5MB    
        private String[] allowedExtensions = {"jpg", "jpeg", "png", "gif", "webp", "svg"};    
        private String[] allowedMimeTypes = {
            "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
        };
    }
}
