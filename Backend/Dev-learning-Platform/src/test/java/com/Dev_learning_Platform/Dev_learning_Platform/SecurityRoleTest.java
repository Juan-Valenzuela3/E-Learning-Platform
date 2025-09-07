package com.Dev_learning_Platform.Dev_learning_Platform;

import java.math.BigDecimal;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test") // fuerza el perfil de test
@TestPropertySource(locations = "classpath:application-test.properties")
@EnableMethodSecurity // Activa @PreAuthorize para esta clase de prueba
class SecurityRoleTest {

    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private CourseService courseService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // <-- ¡Esta es la solución! Neutralizamos el filtro JWT.

    @TestConfiguration
    static class TestConfig {
        @Bean
        public CourseService courseService() {
            // Usar un mock explícito es más robusto que @MockBean para evitar problemas de contexto
            return Mockito.mock(CourseService.class);
        }
    }

@Test
void public_can_list_courses_200() throws Exception {
        // Arrange: Crear datos de prueba más realistas, incluyendo un instructor.
        // La lógica de mapeo a DTO en el controlador probablemente necesita esto.
        User instructor = new User();
        instructor.setId(10L);
        instructor.setUserName("Test");
        instructor.setLastName("Instructor");
        instructor.setRole(User.Role.INSTRUCTOR);
        instructor.setEmail("instructor@test.com");
        instructor.setActive(true);
        instructor.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        instructor.setUpdatedAt(Timestamp.valueOf(LocalDateTime.now()));
        instructor.setProfileImageUrl("http://example.com/profile.jpg");

        Course c1 = new Course();
        c1.setId(1L); c1.setTitle("React"); c1.setInstructor(instructor);
        c1.setIsActive(true);
        c1.setIsPublished(true);
        c1.setDescription("Full description");
        c1.setShortDescription("Short description");
        c1.setPrice(new BigDecimal("19.99"));
        c1.setIsPremium(false);
        c1.setYoutubeUrls(List.of("https://www.youtube.com/watch?v=1"));
        c1.setThumbnailUrl("http://example.com/thumb1.jpg");
        c1.setEstimatedHours(10);
        c1.setCreatedAt(LocalDateTime.now());
        c1.setUpdatedAt(LocalDateTime.now());

        Course c2 = new Course();
        c2.setId(2L); c2.setTitle("Java"); c2.setInstructor(instructor);
        c2.setIsActive(true);
        c2.setIsPublished(true);
        c2.setDescription("Full description");
        c2.setShortDescription("Short description");
        c2.setPrice(new BigDecimal("29.99"));
        c2.setIsPremium(true);
        c2.setYoutubeUrls(List.of("https://www.youtube.com/watch?v=2"));
        c2.setThumbnailUrl("http://example.com/thumb2.jpg");
        c2.setEstimatedHours(20);
        c2.setCreatedAt(LocalDateTime.now());
        c2.setUpdatedAt(LocalDateTime.now());

        Mockito.when(courseService.getPublicCourses()).thenReturn(List.of(c1, c2));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].title", is("React")))
                .andExpect(jsonPath("$[1].title", is("Java")));
    }

    @Test
    void admin_can_access_admin_endpoint_200() throws Exception {
        // Arrange: Simulamos un usuario ADMIN
        setupMockUser("admin-user", "ADMIN");
        Mockito.when(courseService.getAllActiveCourses()).thenReturn(List.of());

        // Act & Assert
        mockMvc.perform(get("/api/courses/admin/active"))
                .andExpect(status().isOk());
    }

    @Test
    void student_cannot_access_admin_endpoint_403() throws Exception {
        // Arrange: Simulamos un usuario STUDENT
        setupMockUser("student-user", "STUDENT");

        // Act & Assert
        mockMvc.perform(get("/api/courses/admin/active"))
                .andExpect(status().isForbidden()); // Esperamos un 403 Forbidden
    }

    /**
     * Helper para simular un usuario autenticado con un rol específico.
     * Reemplaza la necesidad de @WithMockUser.
     */
    private void setupMockUser(String username, String role) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                username, "password", List.of(new SimpleGrantedAuthority("ROLE_" + role)));
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
    }

    @AfterEach
    void tearDown() {
        // Limpiamos el contexto de seguridad después de cada test para evitar interferencias
        SecurityContextHolder.clearContext();
    }
}
