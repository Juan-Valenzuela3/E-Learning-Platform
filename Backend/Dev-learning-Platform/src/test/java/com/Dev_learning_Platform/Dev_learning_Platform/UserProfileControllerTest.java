package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.controllers.UserProfileController;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.profile.UpdateProfileDto;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserProfileController.class)
@ActiveProfiles("test")
@EnableMethodSecurity
@DisplayName("Pruebas para Perfil de Usuario (PB-004)")
class UserProfileControllerTest {

    private final Long studentId = 1L;
    private final String studentEmail = "student@example.com";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private void setupMockUser(Long userId, String email, String role) {
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password("password")
                .authorities("ROLE_" + role)
                .build();

        User appUser = new User();
        appUser.setId(userId);
        appUser.setEmail(email);
        appUser.setUserName("Test");
        appUser.setLastName("User");
        appUser.setRole(User.Role.valueOf(role));
        when(userService.findByEmail(email)).thenReturn(appUser);

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
        SecurityContextHolder.setContext(ctx);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    // --- Tests para GET /api/users/profile ---

    @Test
    @DisplayName("Usuario autenticado puede ver su perfil (200 OK)")
    void getProfile_whenAuthenticated_shouldReturnProfile() throws Exception {
        // Arrange
        setupMockUser(studentId, studentEmail, "STUDENT");

        // Act & Assert
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(studentId))
                .andExpect(jsonPath("$.email").value(studentEmail));
    }

    @Test
    @DisplayName("Usuario anónimo no puede ver perfil (403 Forbidden)")
    void getProfile_whenAnonymous_shouldBeForbidden() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isForbidden());
    }

    // --- Tests para PUT /api/users/profile ---

    @Test
    @DisplayName("Usuario autenticado puede actualizar su perfil con datos válidos (200 OK)")
    void updateProfile_withValidData_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(studentId, studentEmail, "STUDENT");

        UpdateProfileDto updateDto = new UpdateProfileDto();
        updateDto.setUserName("NuevoNombre");
        updateDto.setLastName("NuevoApellido");
        updateDto.setEmail(studentEmail); // Mantenemos el email para no fallar por duplicado

        User updatedUser = new User();
        updatedUser.setId(studentId);
        updatedUser.setUserName("NuevoNombre");
        updatedUser.setLastName("NuevoApellido");
        updatedUser.setEmail(studentEmail);

        when(userService.updateUserProfile(eq(studentId), any(UpdateProfileDto.class))).thenReturn(updatedUser);

        // Act & Assert
        mockMvc.perform(put("/api/users/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userName").value("NuevoNombre"));
    }

    @Test
    @DisplayName("Falla al actualizar perfil con datos inválidos (400 Bad Request)")
    void updateProfile_withInvalidData_shouldFail() throws Exception {
        // Arrange
        setupMockUser(studentId, studentEmail, "STUDENT");

        UpdateProfileDto invalidDto = new UpdateProfileDto();
        invalidDto.setUserName("N"); // Asumimos que el nombre debe tener al menos 2 caracteres
        invalidDto.setLastName("A");
        invalidDto.setEmail("email-invalido");

        // No necesitamos mockear el servicio, ya que la validación de @Valid debe fallar antes.

        // Act & Assert
        mockMvc.perform(put("/api/users/profile")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }
}
