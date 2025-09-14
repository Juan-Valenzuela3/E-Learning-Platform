package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.io.IOException;
import java.util.UUID;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

/**
 * Implementación mock de OciStorageService para tests.
 * Se activa solo en el perfil de test cuando OCI está deshabilitado.
 */
@Slf4j
@Service
@Profile("test")
public class MockOciStorageService extends OciStorageService {

    public MockOciStorageService() {
        super(null, null);
    }

    @Override
    public String uploadProfileImage(MultipartFile file, Long userId) throws IOException {
        log.info("MOCK: Simulando subida de imagen para usuario: {}", userId);
        
        if (file == null || file.isEmpty()) {
            throw new IOException("Archivo vacío o nulo en simulación");
        }
        
        // Generar URL mock
        String mockUrl = String.format("https://mock-storage.example.com/profile-images/user_%d_%s.jpg", 
            userId, UUID.randomUUID().toString());
            
        log.info("MOCK: Imagen simulada subida exitosamente: {}", mockUrl);
        return mockUrl;
    }

    @Override
    public void deleteProfileImage(String imageUrl) {
        log.info("MOCK: Simulando eliminación de imagen: {}", imageUrl);
    }

    @Override
    public boolean isAvailable() {
        return true;
    }
}
