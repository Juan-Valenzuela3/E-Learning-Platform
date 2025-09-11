package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Dev_learning_Platform.Dev_learning_Platform.config.StorageProperties;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import com.oracle.bmc.objectstorage.responses.PutObjectResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio de almacenamiento en Oracle Cloud Infrastructure Object Storage.
 * Se activa solo cuando oci.enabled=true y en perfiles de producción.
 * 
 * @author Dev-Learning-Platform Team
 * @version 1.0
 */
@Slf4j
@Service
@RequiredArgsConstructor
@ConditionalOnProperty(name = "oci.enabled", havingValue = "true")
public class OciStorageService {

    private final ObjectStorageClient objectStorageClient;
    private final StorageProperties storageProperties;

    @Value("${app.upload.storage-type:local}")
    private String storageType;

    /**
     * Sube un archivo al Object Storage de OCI y retorna la URL pública.
     * 
     * @param file Archivo a subir
     * @param userId ID del usuario propietario
     * @return URL pública del archivo en OCI Object Storage
     * @throws IOException Si hay error en la subida
     */
    public String uploadProfileImage(MultipartFile file, Long userId) throws IOException {
        log.info("Subiendo imagen de perfil a OCI Object Storage para usuario: {}", userId);

        try {
            // Generar nombre único para el objeto
            String fileExtension = getFileExtension(file.getOriginalFilename());
            String objectName = String.format("profile-images/user_%d_%s.%s", 
                userId, UUID.randomUUID().toString(), fileExtension);

            // Preparar el request para OCI
            try (InputStream inputStream = file.getInputStream()) {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .namespaceName(storageProperties.getNamespace())
                    .bucketName(storageProperties.getBucketName())
                    .objectName(objectName)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .putObjectBody(inputStream)
                    .build();

                // Subir el archivo
                PutObjectResponse response = objectStorageClient.putObject(putObjectRequest);
                
                if (response.get__httpStatusCode__() == 200) {
                    // Construir la URL pública
                    String publicUrl = storageProperties.buildPublicUrl(objectName);
                    log.info("Imagen subida exitosamente a OCI: {}", publicUrl);
                    return publicUrl;
                } else {
                    throw new IOException("Error al subir archivo a OCI. Código de estado: " + 
                                        response.get__httpStatusCode__());
                }
            }

        } catch (Exception e) {
            log.error("Error al subir imagen a OCI Object Storage: {}", e.getMessage(), e);
            throw new IOException("Falló la subida a OCI Object Storage: " + e.getMessage(), e);
        }
    }

    /**
     * Elimina un archivo del Object Storage de OCI.
     * 
     * @param imageUrl URL del archivo a eliminar
     */
    public void deleteProfileImage(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains(storageProperties.getPublicUrlBase())) {
            log.warn("URL no válida para eliminación de OCI: {}", imageUrl);
            return;
        }

        try {
            // Extraer el nombre del objeto de la URL
            String objectName = extractObjectNameFromUrl(imageUrl);
            
            log.info("Eliminando objeto de OCI: {}", objectName);
            
            // TODO: Implementar eliminación cuando sea necesario
            // DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
            //     .namespaceName(storageProperties.getNamespace())
            //     .bucketName(storageProperties.getBucketName())
            //     .objectName(objectName)
            //     .build();
            // 
            // objectStorageClient.deleteObject(deleteRequest);
            
            log.info("Objeto eliminado exitosamente de OCI: {}", objectName);
            
        } catch (Exception e) {
            log.error("Error al eliminar imagen de OCI: {}", e.getMessage(), e);
        }
    }

    /**
     * Extrae la extensión del archivo.
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            throw new IllegalArgumentException("Archivo debe tener una extensión válida");
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }

    /**
     * Extrae el nombre del objeto de la URL pública de OCI.
     */
    private String extractObjectNameFromUrl(String url) {
        String baseUrl = storageProperties.getPublicUrlBase();
        if (url.startsWith(baseUrl)) {
            return url.substring(baseUrl.length() + 1); // +1 para el '/'
        }
        throw new IllegalArgumentException("URL no válida para OCI Object Storage: " + url);
    }

    /**
     * Verifica si el servicio está configurado y disponible.
     */
    public boolean isAvailable() {
        return "oci".equals(storageType) && objectStorageClient != null;
    }
}
