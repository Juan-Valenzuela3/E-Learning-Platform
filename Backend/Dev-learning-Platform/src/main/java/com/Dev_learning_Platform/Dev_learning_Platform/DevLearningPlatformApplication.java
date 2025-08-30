package com.Dev_learning_Platform.Dev_learning_Platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Clase principal de la aplicación Spring Boot para la plataforma de e-learning.
 * 
 * Esta es la clase de entrada principal que inicia la aplicación Spring Boot.
 * Configura y habilita todas las funcionalidades necesarias para la plataforma.
 * 
 * Características principales:
 * - Configuración automática de Spring Boot
 * - Escaneo automático de componentes (@Component, @Service, @Repository, etc.)
 * - Configuración automática de Spring Security
 * - Configuración automática de JPA/Hibernate
 * - Configuración automática de JWT y autenticación
 * 
 * Anotaciones configuradas:
 * - @SpringBootApplication: Configuración automática completa
 * - @EnableScheduling: Habilita tareas programadas (limpieza de tokens expirados)
 * 
 * Funcionalidades habilitadas:
 * - Autenticación JWT con refresh tokens
 * - Middleware de logging y auditoría
 * - Configuración de seguridad personalizada
 * - Tareas programadas para mantenimiento
 * - CORS configurado para desarrollo
 * 
 * Endpoints disponibles:
 * - /api/auth/** - Autenticación y autorización
 * - /api/public/** - Endpoints públicos
 * - /api/protected/** - Endpoints protegidos
 * - /api/users/** - Gestión de usuarios
 * - /api/refresh-tokens/** - Gestión de refresh tokens
 * - /api/jwt-test/** - Pruebas y testing JWT
 */
@SpringBootApplication
@EnableScheduling
public class DevLearningPlatformApplication {

    /**
     * Método principal que inicia la aplicación Spring Boot.
     * 
     * Este método:
     * 1. Inicia el contexto de Spring Application
     * 2. Configura automáticamente todos los beans necesarios
     * 3. Inicia el servidor web embebido (por defecto en puerto 8080)
     * 4. Habilita todas las funcionalidades configuradas
     * 
     * @param args Argumentos de línea de comandos pasados a la aplicación
     */
    public static void main(String[] args) {
        SpringApplication.run(DevLearningPlatformApplication.class, args);
    }

}
