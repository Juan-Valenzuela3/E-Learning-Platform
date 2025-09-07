package com.Dev_learning_Platform.Dev_learning_Platform.middlewares;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.Dev_learning_Platform.Dev_learning_Platform.services.CustomUserDetailsService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.auth.JwtService;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

   
    @Override
    protected void doFilterInternal(
            @org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Verificar presencia y formato del header Authorization
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("Request sin token JWT válido: {}", request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extraer token del header
        jwt = authHeader.substring(7); // Remover "Bearer " prefix
        
        try {
        
            userEmail = jwtService.extractUsername(jwt);            
            
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {                
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);                
                
                if (jwtService.validateToken(jwt, userDetails)) {                    
                    
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    
                    log.debug("Usuario autenticado exitosamente: {}", userEmail);
                } else {
                    log.warn("Token JWT inválido para usuario: {}", userEmail);
                }
            }
            
        } catch (JwtException | IllegalArgumentException e) {
            log.warn("Error al procesar token JWT: {}", e.getMessage());
        }

        // 8. Continuar con la cadena de filtros
        filterChain.doFilter(request, response);
    }
}
