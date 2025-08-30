package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.web.bind.annotation.*;

/**
 * Controlador para endpoints públicos que no requieren autenticación.
 * 
 * Este controlador proporciona endpoints que pueden ser accedidos
 * sin necesidad de autenticación JWT. Útil para:
 * - Información pública de la plataforma
 * - Endpoints de prueba y verificación
 * - Información general del sistema
 * 
 * Características:
 * - Endpoints accesibles sin token JWT
 * - Información no sensible
 * - Respuestas simples y directas
 * - Configurado bajo /api/public/**
 * 
 * Uso:
 * - Pruebas de conectividad
 * - Información pública del sistema
 * - Verificación de estado del servidor
 */
@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class PublicController {

    /**
     * Endpoint de saludo público para verificar conectividad.
     * 
     * Este endpoint se usa principalmente para:
     * - Verificar que el servidor esté funcionando
     * - Probar conectividad desde el cliente
     * - Confirmar que los endpoints públicos son accesibles
     * 
     * @return Mensaje de saludo confirmando que el endpoint funciona
     */
    @GetMapping("/hello")
    public String hello() {
        return "¡Hola! Este es un endpoint público que no requiere autenticación.";
    }

    /**
     * Endpoint para obtener información pública de la plataforma.
     * 
     * Este endpoint proporciona información general sobre la plataforma
     * que puede ser útil para usuarios no autenticados.
     * 
     * @return Información pública de la plataforma de e-learning
     */
    @GetMapping("/info")
    public String info() {
        return "Información pública de la plataforma de e-learning";
    }
}
