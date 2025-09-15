package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import com.oracle.bmc.auth.AuthenticationDetailsProvider;
import com.oracle.bmc.objectstorage.ObjectStorageClient;

/**
 * Configuración de test que proporciona mocks para los componentes OCI
 * que no están disponibles en el entorno de pruebas.
 */
@TestConfiguration
@Profile("test")
public class TestConfig {

    /**
     * Bean mock para ObjectStorageClient en tests.
     * Se marca como @Primary para que tenga prioridad sobre cualquier otro bean del mismo tipo.
     */
    @Bean
    @Primary
    public ObjectStorageClient mockObjectStorageClient() {
        ObjectStorageClient mock = Mockito.mock(ObjectStorageClient.class);
        // Configurar comportamiento básico si es necesario
        return mock;
    }

    /**
     * Bean mock para AuthenticationDetailsProvider en tests.
     */
    @Bean
    @Primary
    public AuthenticationDetailsProvider mockAuthenticationDetailsProvider() {
        AuthenticationDetailsProvider mock = Mockito.mock(AuthenticationDetailsProvider.class);
        // Configurar comportamiento básico si es necesario
        return mock;
    }
}
