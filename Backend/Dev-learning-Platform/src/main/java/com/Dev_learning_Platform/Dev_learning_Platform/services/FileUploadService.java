package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Dev_learning_Platform.Dev_learning_Platform.config.FileUploadConfig;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para manejo de carga de archivos.
 * Implementa validaciones robustas y está preparado para migración a Oracle Cloud Object Storage.
 * 
 * @author Dev-Learning-Platform Team
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FileUploadService {
    
    private final FileUploadConfig fileUploadConfig;
    
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
        
        String imageUrl = saveFileToFileSystem(file, userId);
        
        log.info("Imagen de perfil subida exitosamente: {}", imageUrl);
        return imageUrl;
    }
    
    /**
     * Guarda el archivo en el sistema de archivos local.
     */
    private String saveFileToFileSystem(MultipartFile file, Long userId) throws IOException {
        var config = fileUploadConfig.getProfileImages();
        
        // Crear directorio si no existe
        Path uploadDir = Paths.get(config.getPath());
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
            log.info("Directorio creado: {}", uploadDir);
        }
        
        // Generar nombre único para evitar colisiones
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = String.format("user_%d_%s.%s", 
            userId, UUID.randomUUID().toString(), extension);
        
        // Guardar archivo
        Path filePath = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        return config.getBaseUrl() + "/" + filename;
    }
    
    /**
     * Valida que el archivo sea una imagen válida según las configuraciones.
     */
    private void validateFile(MultipartFile file) {
        var config = fileUploadConfig.getProfileImages();
        
        // Validación de archivo vacío
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
        
        // Validación de tamaño
        if (file.getSize() > config.getMaxFileSize()) {
            throw new IllegalArgumentException(
                String.format("El archivo excede el tamaño máximo permitido (%d MB)", 
                config.getMaxFileSize() / (1024 * 1024))
            );
        }
        
        // Validación de nombre de archivo
        String filename = file.getOriginalFilename();
        if (filename == null || filename.trim().isEmpty()) {
            throw new IllegalArgumentException("Nombre de archivo inválido");
        }
        
        // Validación de extensión
        String extension = getFileExtension(filename).toLowerCase();
        if (!Arrays.asList(config.getAllowedExtensions()).contains(extension)) {
            throw new IllegalArgumentException(
                "Tipo de archivo no permitido. Extensiones válidas: " + 
                Arrays.toString(config.getAllowedExtensions())
            );
        }
        
        // Validación de MIME type
        String contentType = file.getContentType();
        if (contentType == null || !Arrays.asList(config.getAllowedMimeTypes()).contains(contentType)) {
            throw new IllegalArgumentException(
                "Tipo de contenido no permitido. Tipos válidos: " + 
                Arrays.toString(config.getAllowedMimeTypes())
            );
        }
    }
    
    /**
     * Extrae la extensión del archivo de forma segura.
     */
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            throw new IllegalArgumentException("El archivo debe tener una extensión");
        }
        return filename.substring(lastDotIndex + 1);
    }
    
    /**
     * Elimina una imagen de perfil del sistema de archivos.
     */
    public void deleteProfileImage(String imageUrl) {
        var config = fileUploadConfig.getProfileImages();
        
        if (imageUrl == null || !imageUrl.startsWith(config.getBaseUrl())) {
            log.warn("URL no válida para eliminación: {}", imageUrl);
            return;
        }
        
        try {
            String filename = imageUrl.substring(config.getBaseUrl().length() + 1);
            Path filePath = Paths.get(config.getPath(), filename);
            
            if (Files.deleteIfExists(filePath)) {
                log.info("Imagen eliminada exitosamente: {}", imageUrl);
            } else {
                log.warn("Imagen no encontrada para eliminación: {}", imageUrl);
            }
        } catch (IOException e) {
            log.error("Error al eliminar imagen: {}", imageUrl, e);
        }
    }
}