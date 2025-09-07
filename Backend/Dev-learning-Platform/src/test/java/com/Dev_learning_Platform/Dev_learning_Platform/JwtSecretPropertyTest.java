package com.Dev_learning_Platform.Dev_learning_Platform;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

/**
 * Test MUY liviano que solo verifica que la propiedad JWT_SECRET_KEY
 * se resuelve desde src/test/resources/application-test.properties.
 * No escanea componentes ni arranca la app completa.
 */
@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = JwtSecretPropertyTest.MinimalTestConfig.class)
@TestPropertySource(locations = "classpath:application-test.properties")
class JwtSecretPropertyTest {

    @Configuration
    static class MinimalTestConfig {
        // Config vacía a propósito: no escaneamos beans de la app.
    }

    @Value("${JWT_SECRET_KEY}")
    private String jwtSecret;

    @Test
    void jwtSecret_property_is_loaded_and_long_enough() {
        assertThat(jwtSecret)
                .as("JWT_SECRET_KEY debe existir en application-test.properties")
                .isNotBlank();
        assertThat(jwtSecret.length())
                .as("La clave debe tener al menos 32 caracteres")
                .isGreaterThanOrEqualTo(32);
    }

}
