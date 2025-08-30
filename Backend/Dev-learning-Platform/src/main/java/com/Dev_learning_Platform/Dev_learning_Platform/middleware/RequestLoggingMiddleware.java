package com.Dev_learning_Platform.Dev_learning_Platform.middleware;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Middleware para logging y auditoría de requests HTTP.
 * 
 * Este middleware intercepta todas las requests y responses para:
 * - Registrar información detallada de cada request
 * - Capturar IP del cliente y User-Agent
 * - Medir tiempo de respuesta
 * - Loggear headers (excluyendo información sensible)
 * - Loggear body de responses JSON
 * - Proporcionar auditoría completa de la aplicación
 * 
 * Características de seguridad:
 * - Filtra headers sensibles (Authorization, Cookie, etc.)
 * - Solo loggea contenido JSON (no binario)
 * - Excluye recursos estáticos y health checks
 * - Logging estructurado para fácil análisis
 */
@Component
@Order(0)
public class RequestLoggingMiddleware extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingMiddleware.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                  HttpServletResponse response, 
                                  FilterChain filterChain) throws ServletException, IOException {
        
        long startTime = System.currentTimeMillis();
        String requestURI = request.getRequestURI();
        String method = request.getMethod();
        String userAgent = request.getHeader("User-Agent");
        String clientIP = getClientIP(request);
        
        // Log request
        logger.info("=== REQUEST START ===");
        logger.info("Timestamp: {}", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        logger.info("Method: {} {}", method, requestURI);
        logger.info("Client IP: {}", clientIP);
        logger.info("User-Agent: {}", userAgent);
        
        // Log headers (excluding sensitive ones)
        request.getHeaderNames().asIterator().forEachRemaining(headerName -> {
            if (!isSensitiveHeader(headerName)) {
                logger.info("Header {}: {}", headerName, request.getHeader(headerName));
            }
        });

        // Wrap request and response for content logging
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(wrappedRequest, wrappedResponse);
        } finally {
            // Log response
            long duration = System.currentTimeMillis() - startTime;
            logger.info("=== RESPONSE ===");
            logger.info("Status: {}", wrappedResponse.getStatus());
            logger.info("Duration: {}ms", duration);
            
            // Log response body for non-binary content
            if (wrappedResponse.getContentType() != null && 
                wrappedResponse.getContentType().contains("application/json")) {
                String responseBody = new String(wrappedResponse.getContentAsByteArray(), StandardCharsets.UTF_8);
                if (responseBody.length() > 0) {
                    logger.info("Response Body: {}", responseBody);
                }
            }
            
            logger.info("=== REQUEST END ===");
            
            // Copy response back to original response
            wrappedResponse.copyBodyToResponse();
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0];
        }
        
        String xRealIP = request.getHeader("X-Real-IP");
        if (xRealIP != null && !xRealIP.isEmpty() && !"unknown".equalsIgnoreCase(xRealIP)) {
            return xRealIP;
        }
        
        return request.getRemoteAddr();
    }

    private boolean isSensitiveHeader(String headerName) {
        String lowerHeader = headerName.toLowerCase();
        return lowerHeader.contains("authorization") || 
               lowerHeader.contains("cookie") || 
               lowerHeader.contains("password") ||
               lowerHeader.contains("secret");
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // No logear requests a recursos estáticos o health checks
        return path.contains("/actuator/") || 
               path.contains("/h2-console") || 
               path.contains("/favicon.ico") ||
               path.contains("/error");
    }
}
