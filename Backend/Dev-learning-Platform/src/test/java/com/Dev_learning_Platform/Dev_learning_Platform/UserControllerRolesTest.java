package com.Dev_learning_Platform.Dev_learning_Platform;


import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.TestPropertySource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.mockito.Mockito.reset;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@EnableMethodSecurity // Activa @PreAuthorize para esta clase de prueba
class UserControllerRolesTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserService userService; // es el mock definido abajo en TestConfig

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // Neutralizamos el filtro JWT

    // ---------- TESTS ----------

    @Test
    void admin_can_get_all_users_200() throws Exception {
        // Arrange
        setupMockUser("admin-user", "ADMIN");
        reset(userService);
        Mockito.when(userService.getAllUsers()).thenReturn(
                List.of(fakeUser(1L, "admin@example.com", User.Role.ADMIN))
        );

        // Act & Assert
        mockMvc.perform(get("/api/users/all"))
                .andExpect(status().isOk());
    }

    // ---------- HELPERS ----------

    @AfterEach
    void tearDown() {
        // Limpiamos el contexto de seguridad después de cada test para evitar interferencias
        SecurityContextHolder.clearContext();
    }

    private void setupMockUser(String username, String role) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                username, "password", List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    @SuppressWarnings("unused")
    private User fakeUser(Long id, String email, User.Role role) {
        User u = new User();
        u.setId(id);
        u.setEmail(email);
        u.setUserName("Nombre");
        u.setLastName("Apellido");
        u.setPassword("x");
        u.setRole(role);
        u.setActive(true);
        return u;
    }

    // ---------- CONFIGURACIÓN DE TEST ----------

    @TestConfiguration
    static class TestConfig {
        @Bean
        UserService userService() {
            return Mockito.mock(UserService.class);
        }
    }
}
