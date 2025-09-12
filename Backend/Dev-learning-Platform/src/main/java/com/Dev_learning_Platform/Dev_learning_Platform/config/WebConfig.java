package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        log.info("Configurando CORS para frontend: {}", frontendUrl);
        
        registry.addMapping("/api/**")
                .allowedOrigins(frontendUrl, "http://localhost:5173", "https://tu-dominio-vercel.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
        
        log.info("CORS configurado correctamente");
    }
}