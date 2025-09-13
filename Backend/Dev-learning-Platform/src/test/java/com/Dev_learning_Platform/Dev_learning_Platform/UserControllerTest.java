package com.Dev_learning_Platform.Dev_learning_Platform;

import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.config.TestConfig;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.UserRegisterDto;
import com.fasterxml.jackson.databind.ObjectMapper;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@Import(TestConfig.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String uniqueTimestamp;

    @BeforeEach
    void setUp() {
        uniqueTimestamp = String.valueOf(Instant.now().toEpochMilli());
    }

    @Test
    @DisplayName("Debe registrar usuario nuevo exitosamente")
    void registerUser_withUniqueData_shouldReturnOk() throws Exception {
        UserRegisterDto dto = createUniqueUserDto("nuevo.usuario");

        mockMvc.perform(post("/api/users/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(dto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(dto.getEmail()))
                .andExpect(jsonPath("$.id").exists());

        System.out.println("✅ Registro de usuario nuevo exitoso con email: " + dto.getEmail());
    }

    @Test
    @DisplayName("Debe fallar al registrar usuario duplicado")
    void registerUser_withDuplicateEmail_shouldReturnConflict() throws Exception {
        UserRegisterDto originalUser = createUniqueUserDto("usuario.duplicado");

        // Registrar el primer usuario
        mockMvc.perform(post("/api/users/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(originalUser)))
                .andExpect(status().isOk());

        // Intentar registrar el mismo email
        UserRegisterDto duplicateUser = createUniqueUserDto("usuario.diferente");
        duplicateUser.setEmail(originalUser.getEmail()); // Fuerza el email duplicado

        mockMvc.perform(post("/api/users/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(duplicateUser)))
                .andDo(print())
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("EMAIL_ALREADY_EXISTS"))
                .andExpect(jsonPath("$.message").exists());

        System.out.println("✅ Manejo correcto de email duplicado: " + duplicateUser.getEmail());
    }

    @Test
    @DisplayName("Debe fallar con datos inválidos")
    void registerUser_withInvalidData_shouldReturnBadRequest() throws Exception {
        UserRegisterDto invalidDto = new UserRegisterDto();
        invalidDto.setUserName(""); // Nombre vacío
        invalidDto.setLastName("");
        invalidDto.setEmail("email-invalido"); // Email sin formato válido
        invalidDto.setPassword("123"); // Password muy corto
        invalidDto.setRole(com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.STUDENT);

        mockMvc.perform(post("/api/users/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(invalidDto)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.errors").isArray());

        System.out.println("✅ Validación correcta de datos inválidos");
    }

    @Test
    @DisplayName("Debe fallar con email null")
    void registerUser_withNullEmail_shouldReturnBadRequest() throws Exception {
        UserRegisterDto dto = new UserRegisterDto();
        dto.setUserName("usuario");
        dto.setLastName("apellido");
        dto.setEmail(null); // Email null
        dto.setPassword("password123");
        dto.setRole(com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.STUDENT);

        mockMvc.perform(post("/api/users/register")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(dto)))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"))
                .andExpect(jsonPath("$.errors").exists())
                .andExpect(jsonPath("$.errors").isArray());

        System.out.println("✅ Validación correcta de email null");
    }

    /**
     * Helper method para crear usuarios únicos
     */
    private UserRegisterDto createUniqueUserDto(String baseUsername) {
        UserRegisterDto dto = new UserRegisterDto();
        dto.setUserName(baseUsername + uniqueTimestamp);
        dto.setLastName("Apellido" + uniqueTimestamp);
        dto.setEmail(baseUsername + uniqueTimestamp + "@example.com");
        dto.setPassword("password123");
        dto.setRole(com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.STUDENT);
        return dto;
    }
}
