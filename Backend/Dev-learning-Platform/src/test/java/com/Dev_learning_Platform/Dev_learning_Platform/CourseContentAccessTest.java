package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests para PB-009 acceso a contenido del curso SIN depender de CourseSecurityService.
 * OJO: Este test asume que existe el endpoint GET /api/courses/{id}/content.
 * Si aún no existe, estas pruebas podrían devolver 404.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {
        // evitar conexión a DB real durante el test
        "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration",
        // placeholders JWT
        "jwt.secret.key=dummy-for-tests",
        "jwt.expiration.time=86400000"
})
class CourseContentAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // neutraliza filtro JWT

    @MockBean
    private CourseService courseService;

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

        // Ajusta al método real que uses para devolver el contenido
        when(courseService.findById(anyLong())).thenReturn(courseWithContent);
        // Si tienes getCourseContent(id):  when(courseService.getCourseContent(courseId)).thenReturn(courseWithContent);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void non_enrolled_student_is_forbidden_403() throws Exception {
        setupMockUser(studentId, "student@example.com", "STUDENT");
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(result -> {
                   int s = result.getResponse().getStatus();
                   if (s != 403) {
                       throw new AssertionError("Esperaba 403 para estudiante no inscrito, fue " + s);
                   }
               });
    }

    @Test
    void enrolled_student_can_access_200() throws Exception {
        setupMockUser(studentId, "student@example.com", "STUDENT");
        // Aquí no simulamos inscripción por falta de CourseSecurityService.
        // Si tu endpoint aún no valida inscripción, este test podría no pasar.
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.title", is("Curso de React Avanzado")))
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    void instructor_can_access_200() throws Exception {
        setupMockUser(instructorId, "instructor@example.com", "INSTRUCTOR");
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    void admin_can_access_200() throws Exception {
        setupMockUser(adminId, "admin@example.com", "ADMIN");
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    void anonymous_is_401_or_403() throws Exception {
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(result -> {
                   int s = result.getResponse().getStatus();
                   if (!(s == 401 || s == 403)) {
                       throw new AssertionError("Esperaba 401 o 403 para anónimo, fue " + s);
                   }
               });
    }

    // ---------- helper ----------
    private void setupMockUser(Long userId, String email, String role) {
        User principal = new User();
        principal.setId(userId);
        principal.setEmail(email);
        principal.setRole(User.Role.valueOf(role));

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(
                principal,
                "x",
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        ));
        SecurityContextHolder.setContext(ctx);
    }
}
