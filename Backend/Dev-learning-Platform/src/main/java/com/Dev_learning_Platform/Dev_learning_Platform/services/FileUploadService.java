package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.io.IOException;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Dev_learning_Platform.Dev_learning_Platform.config.FileUploadConfig;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class FileUploadService {
    
    private final FileUploadConfig fileUploadConfig;
    private final OciStorageService ociStorageService;
    
    @Value("${spring.profiles.active:}")
    private String activeProfile;
    
    // Constructor que hace OciStorageService opcional
    public FileUploadService(FileUploadConfig fileUploadConfig, 
                           @Autowired(required = false) OciStorageService ociStorageService) {
        this.fileUploadConfig = fileUploadConfig;
        this.ociStorageService = ociStorageService;
    }

    /**
     * Sube una imagen de perfil y retorna la URL de acceso.
     * 
     * @param file Archivo de imagen a subir
     * @param userId ID del usuario propietario
     * @return URL completa de la imagen subida
     * @throws IOException Si hay error en la subida
     * @throws IllegalArgumentException Si el archivo no es válido
     */
    public String uploadProfileImage(MultipartFile file, Long userId) throws IOException {
        log.info("Iniciando subida de imagen de perfil para usuario: {}", userId);
        
        validateFile(file);
        
        String imageUrl;
 
        if ("test".equals(activeProfile)) {
            log.info("Perfil de test detectado, simulando subida de imagen");
            imageUrl = generateMockImageUrl(userId);
        }
 
        else if (ociStorageService != null && ociStorageService.isAvailable()) {
            log.info("Subiendo imagen a OCI Object Storage");
            imageUrl = ociStorageService.uploadProfileImage(file, userId);
        } else {
            log.error("OCI Object Storage no está disponible. Verificar configuración.");
            throw new IOException("Servicio de almacenamiento no disponible. Contactar al administrador.");
        }
        
        log.info("Imagen de perfil subida exitosamente: {}", imageUrl);
        return imageUrl;
    }

    public void deleteProfileImage(String imageUrl) {
        if (imageUrl == null) {
            log.warn("URL nula para eliminación");
            return;
        }
 
        if ("test".equals(activeProfile)) {
            log.info("Perfil de test detectado, simulando eliminación de imagen: {}", imageUrl);
            return;
        }

        if (ociStorageService != null && imageUrl.contains("objectstorage.") && imageUrl.contains("oraclecloud.com")) {
            log.info("Eliminando imagen de OCI Object Storage");
            ociStorageService.deleteProfileImage(imageUrl);
        } else {
            log.warn("URL no válida para OCI Object Storage o servicio no disponible: {}", imageUrl);
        }
    }

    private String generateMockImageUrl(Long userId) {
        return String.format("https://mock-storage.example.com/profile-images/user_%d_%s.jpg", 
            userId, UUID.randomUUID().toString());
    }

    private void validateFile(MultipartFile file) {
        var config = fileUploadConfig.getProfileImages();

        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        if (file.getSize() > config.getMaxFileSize()) {
            throw new IllegalArgumentException(
                String.format("El archivo excede el tamaño máximo permitido (%d MB)", 
                config.getMaxFileSize() / (1024 * 1024))
            );
        }

        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Nombre de archivo inválido");
        }

        String extension = getFileExtension(filename).toLowerCase();
        if (!Arrays.asList(config.getAllowedExtensions()).contains(extension)) {
            throw new IllegalArgumentException(
                "Tipo de archivo no permitido. Extensiones válidas: " + 
                Arrays.toString(config.getAllowedExtensions())
            );
        }

        String contentType = file.getContentType();
        if (contentType == null || !Arrays.asList(config.getAllowedMimeTypes()).contains(contentType)) {
            throw new IllegalArgumentException(
                "Tipo de contenido no permitido. Tipos válidos: " + 
                Arrays.toString(config.getAllowedMimeTypes())
            );
        }
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            throw new IllegalArgumentException("El archivo debe tener una extensión");
        }
        return filename.substring(lastDotIndex + 1);
    }
}