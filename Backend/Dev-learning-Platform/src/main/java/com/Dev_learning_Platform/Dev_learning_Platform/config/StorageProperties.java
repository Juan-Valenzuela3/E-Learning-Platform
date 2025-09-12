package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Component
@Validated
@ConfigurationProperties(prefix = "oci.objectstorage")
public class StorageProperties {

    @NotBlank(message = "El namespace de OCI es requerido")
    private String namespace;

    @NotBlank(message = "El nombre del bucket es requerido")
    private String bucketName;

    @NotBlank(message = "La URL base pública es requerida")
    private String publicUrlBase;

    @NotBlank(message = "La región de OCI es requerida")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Formato de región inválido")
    private String region;

    private String compartmentId;

    public String buildPublicUrl(String objectName) {
        return String.format("%s/%s", publicUrlBase, objectName);
    }
}