package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.controllers.CourseController;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests para PB-009: Acceso al contenido del curso.
 * OJO: Este test asume que existe el endpoint GET /api/courses/{id}/content.
 * Si aún no existe, estas pruebas podrían devolver 404.
 */
@WebMvcTest(CourseController.class) // 1. Enfocamos el test en el controlador correcto
@ActiveProfiles("test")
@EnableMethodSecurity // 2. Habilitamos la seguridad a nivel de método para @PreAuthorize
public class CourseContentAccessTest {

    @Autowired
    private MockMvc mockMvc;

    // 3. Declaramos las dependencias del controlador como @MockBean a nivel de clase.
    // Spring reemplazará los beans reales con estos mocks en el contexto de prueba.
    @MockBean
    private CourseService courseService;

    @MockBean
    private EnrollmentService enrollmentService;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // Necesario para evitar errores de seguridad

    private final Long courseId = 1L;
    private final Long studentId = 10L;
    private final Long instructorId = 20L;
    private final Long adminId = 30L;

    @BeforeEach
    void setUp() {
        Course courseWithContent = new Course();
        courseWithContent.setId(courseId);
        courseWithContent.setTitle("Curso de React Avanzado");
        courseWithContent.setYoutubeUrls(List.of(
                "https://youtube.com/watch?v=video1",
                "https://youtube.com/watch?v=video2"
        ));

        when(courseService.findById(courseId)).thenReturn(courseWithContent);
        // Si tienes getCourseContent(id):  when(courseService.getCourseContent(courseId)).thenReturn(courseWithContent);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Estudiante NO inscrito no puede ver contenido (403 Forbidden)")
    void nonEnrolledStudent_isForbidden() throws Exception {
        // Arrange: Simulamos un estudiante autenticado
        String studentEmail = "student@example.com";
        setupMockUser(studentId, studentEmail, "STUDENT");
        // Arrange: Simulamos que el método isStudentEnrolled (que usa el ID) devuelve 'false'
        when(enrollmentService.isStudentEnrolled(eq(studentId), eq(courseId))).thenReturn(false);

        // Act & Assert
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Estudiante INSCRITO puede ver contenido (200 OK)")
    void enrolledStudent_canAccessContent() throws Exception {
        // Arrange: Simulamos un estudiante autenticado
        String studentEmail = "student@example.com";
        setupMockUser(studentId, studentEmail, "STUDENT");
        // Arrange: Simulamos que el método isStudentEnrolled (que usa el ID) devuelve 'true'
        when(enrollmentService.isStudentEnrolled(eq(studentId), eq(courseId))).thenReturn(true);

        // Act & Assert
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.title", is("Curso de React Avanzado")))
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    @DisplayName("Instructor puede ver contenido (200 OK)")
    void instructor_canAccessContent() throws Exception {
        setupMockUser(instructorId, "instructor@example.com", "INSTRUCTOR");
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    @DisplayName("Admin puede ver contenido (200 OK)")
    void admin_canAccessContent() throws Exception {
        setupMockUser(adminId, "admin@example.com", "ADMIN");
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    @DisplayName("Usuario anónimo no puede ver contenido (401 Unauthorized)")
    void anonymous_isForbidden() throws Exception {
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isUnauthorized()); // 401 es la respuesta correcta para usuarios no autenticados
    }

    // ---------- helper ----------
    private void setupMockUser(Long userId, String email, String role) {
        // Usamos UserDetails que es lo que Spring Security maneja internamente
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(email) // El "username" para Spring Security es el email
                .password("password")
                .authorities("ROLE_" + role)
                .build();

        // ESTE ES EL MOCK QUE FALTABA:
        // Simulamos que cuando se busque un usuario por su email, se devuelva un objeto User con su ID.
        User appUser = new User();
        appUser.setId(userId);
        when(userService.findByEmail(email)).thenReturn(appUser);

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(
                userDetails, // El principal es UserDetails
                null,
                userDetails.getAuthorities()
        ));
        SecurityContextHolder.setContext(ctx);
    }
}
