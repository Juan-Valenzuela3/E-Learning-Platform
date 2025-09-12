package com.Dev_learning_Platform.Dev_learning_Platform.services.auth;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

/**
 * Facade para servicios JWT siguiendo principios SOLID.
 * Orquesta los componentes especializados manteniendo SRP.
 */
@Service
public class JwtService {

    private final JwtTokenGenerator tokenGenerator;
    private final JwtTokenValidator tokenValidator;
    private final JwtClaimsExtractor claimsExtractor;

    public JwtService(JwtTokenGenerator tokenGenerator, 
                     JwtTokenValidator tokenValidator,
                     JwtClaimsExtractor claimsExtractor) {
        this.tokenGenerator = tokenGenerator;
        this.tokenValidator = tokenValidator;
        this.claimsExtractor = claimsExtractor;
    }

    public String generateToken(UserDetails userDetails) {
        return tokenGenerator.generateToken(userDetails);
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return tokenValidator.validateToken(token, userDetails);
    }

    public String extractUsername(String token) {
        return claimsExtractor.extractUsername(token);
    }

    public boolean isTokenExpired(String token) {
        return tokenValidator.isTokenExpired(token);
    }
}
