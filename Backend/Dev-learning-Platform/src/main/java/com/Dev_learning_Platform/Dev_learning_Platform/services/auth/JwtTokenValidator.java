package com.Dev_learning_Platform.Dev_learning_Platform.services.auth;

import java.util.Date;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenValidator {

    private final JwtClaimsExtractor claimsExtractor;

    public JwtTokenValidator(JwtClaimsExtractor claimsExtractor) {
        this.claimsExtractor = claimsExtractor;
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = claimsExtractor.extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return claimsExtractor.extractExpiration(token).before(new Date());
    }
}
