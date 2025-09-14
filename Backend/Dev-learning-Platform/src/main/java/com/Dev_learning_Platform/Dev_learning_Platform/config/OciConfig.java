package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.oracle.bmc.ConfigFileReader;
import com.oracle.bmc.auth.AuthenticationDetailsProvider;
import com.oracle.bmc.auth.ConfigFileAuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorageClient;

import lombok.extern.slf4j.Slf4j;

@Configuration
@Slf4j
@ConditionalOnProperty(name = "oci.enabled", havingValue = "true", matchIfMissing = false)
@Profile("!test")
public class OciConfig {

    @Value("${oci.config.file:#{null}}")
    private String configFile;

    @Value("${oci.config.profile:DEFAULT}")
    private String configProfile;

    @Bean
    public AuthenticationDetailsProvider authenticationDetailsProvider() {
        try {
            if (configFile != null) {
                log.info("Configurando autenticación OCI con archivo de configuración: {}", configFile);
                return new ConfigFileAuthenticationDetailsProvider(configFile, configProfile);
            } else {
                log.info("Configurando autenticación OCI con archivo de configuración por defecto");
                return new ConfigFileAuthenticationDetailsProvider(ConfigFileReader.DEFAULT_FILE_PATH, configProfile);
            }
        } catch (Exception e) {
            log.error("Error al configurar autenticación OCI: {}", e.getMessage());
            throw new RuntimeException("No se pudo configurar la autenticación OCI", e);
        }
    }

    @Bean
    public ObjectStorageClient objectStorageClient(AuthenticationDetailsProvider authProvider) {
        try {
            log.info("Creando cliente ObjectStorage");
            return ObjectStorageClient.builder()
                    .build(authProvider);
        } catch (Exception e) {
            log.error("Error al crear cliente ObjectStorage: {}", e.getMessage());
            throw new RuntimeException("No se pudo crear el cliente ObjectStorage", e);
        }
    }
}
