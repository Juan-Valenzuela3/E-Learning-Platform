package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.controllers.CourseController;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Disabled;
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
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CourseController.class)
@ActiveProfiles("test")
@EnableMethodSecurity
@DisplayName("Pruebas para CourseController")
class CourseControllerTest {

    private final Long courseOwnerId = 1L;
    private final Long anotherInstructorId = 2L;
    private final Long adminId = 3L;
    private final Long studentId = 4L;
    private final Long courseId = 100L;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CourseService courseService;

    @MockBean
    private EnrollmentService enrollmentService;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private void setupMockUser(Long userId, String role) {
        String email = role.toLowerCase() + userId + "@example.com";
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password("password")
                .authorities("ROLE_" + role)
                .build();

        User appUser = new User();
        appUser.setId(userId);
        appUser.setEmail(email);
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

    // --- Tests para Gestión de Cursos (Crear, Editar, Eliminar) ---

    @Test
    @DisplayName("Instructor puede crear un curso (201 Created)")
    void createCourse_byInstructor_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        CourseCreateDto createDto = new CourseCreateDto();
        createDto.setTitle("Curso de Introducción a Docker");
        createDto.setInstructorId(courseOwnerId);

        Course createdCourse = new Course();
        createdCourse.setId(courseId);
        createdCourse.setTitle("Curso de Introducción a Docker");

        when(courseService.createCourse(any(CourseCreateDto.class))).thenReturn(createdCourse);

        // Act & Assert
        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(courseId))
                .andExpect(jsonPath("$.title").value("Curso de Introducción a Docker"));
    }

    @Test
    @DisplayName("Estudiante no puede crear un curso (403 Forbidden)")
    void createCourse_byStudent_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        CourseCreateDto createDto = new CourseCreateDto();
        createDto.setTitle("Intento de curso");

        // Act & Assert
        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Falla al crear curso con datos inválidos (400 Bad Request)")
    void createCourse_withInvalidData_shouldFail() throws Exception {
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        CourseCreateDto invalidDto = new CourseCreateDto(); // DTO vacío o con datos inválidos
        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDto)))
                .andExpect(status().isBadRequest());
    }

    // --- Tests para PUT /api/courses/{id} ---


    @Test
    @DisplayName("Instructor propietario puede editar su curso (200 OK)")
     void updateCourse_byOwner_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        CourseCreateDto updateDto = new CourseCreateDto();
        updateDto.setTitle("Nuevo Título del Curso");

        Course updatedCourse = new Course();
        updatedCourse.setId(courseId);
        updatedCourse.setTitle("Nuevo Título del Curso");

        // Simulamos la lógica de negocio: el servicio verifica la propiedad y actualiza.
        // La anotación @PreAuthorize solo valida el rol, pero el servicio valida la propiedad.
        // Al mockear el servicio, asumimos que la validación de propiedad dentro del servicio es exitosa.
        when(courseService.updateCourse(eq(courseId), any(CourseCreateDto.class))).thenReturn(updatedCourse);

        // Act & Assert
        mockMvc.perform(put("/api/courses/{id}", courseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Nuevo Título del Curso"));
    }

    @Test
    @DisplayName("Admin puede editar cualquier curso (200 OK)")
    void updateCourse_byAdmin_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(adminId, "ADMIN");
        CourseCreateDto updateDto = new CourseCreateDto();
        updateDto.setTitle("Título Editado por Admin");

        Course updatedCourse = new Course();
        updatedCourse.setId(courseId);
        updatedCourse.setTitle("Título Editado por Admin");

        when(courseService.updateCourse(eq(courseId), any(CourseCreateDto.class))).thenReturn(updatedCourse);

        // Act & Assert
        mockMvc.perform(put("/api/courses/{id}", courseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Instructor NO propietario no puede editar curso (403 Forbidden)")
    void updateCourse_byNonOwner_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(anotherInstructorId, "INSTRUCTOR");
        CourseCreateDto updateDto = new CourseCreateDto();
        updateDto.setTitle("Intento de Edición");

        // Simulamos que el servicio lanza una excepción de seguridad al fallar la verificación de propiedad.
        when(courseService.updateCourse(eq(courseId), any(CourseCreateDto.class))).thenThrow(new org.springframework.security.access.AccessDeniedException("No eres el propietario de este curso"));

        // La capa de seguridad @PreAuthorize debería bloquear esto antes de llegar al servicio.
        // Si el servicio también valida, se puede mockear una excepción.

        // Act & Assert
        mockMvc.perform(put("/api/courses/{id}", courseId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isForbidden());
    }

    // --- Tests para DELETE /api/courses/{id} ---

    @Test
    @DisplayName("Instructor propietario puede eliminar su curso (204 No Content)")
    void deleteCourse_byOwner_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        // Simulamos que la lógica de negocio (el servicio) permite la eliminación
        // La anotación @PreAuthorize solo valida el rol, no la propiedad.
        // La propiedad se valida dentro del método del servicio.
        doNothing().when(courseService).deleteCourse(eq(courseId));

        // Act & Assert
        mockMvc.perform(delete("/api/courses/{id}", courseId))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Estudiante no puede eliminar un curso (403 Forbidden)")
    void deleteCourse_byStudent_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");

        // Act & Assert
        mockMvc.perform(delete("/api/courses/{id}", courseId))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Falla al eliminar curso con inscripciones existentes (409 Conflict)")
    void deleteCourse_withExistingEnrollments_shouldReturnConflict() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        // Simulamos que el servicio lanza una excepción que el ControllerAdvice convierte en 409.
        doThrow(new IllegalStateException("El curso tiene inscripciones activas y no puede ser eliminado"))
                .when(courseService).deleteCourse(eq(courseId));

        // Act & Assert
        mockMvc.perform(delete("/api/courses/{id}", courseId))
                .andExpect(status().isConflict());
    }

    // --- Tests para Acceso al Contenido del Curso (PB-009) ---

    private Course setupCourseWithContent() {
        Course courseWithContent = new Course();
        courseWithContent.setId(courseId);
        courseWithContent.setTitle("Curso de React Avanzado");
        courseWithContent.setYoutubeUrls(List.of(
                "https://youtube.com/watch?v=video1",
                "https://youtube.com/watch?v=video2"
        ));
        when(courseService.findById(courseId)).thenReturn(courseWithContent);
        return courseWithContent;
    }

    @Test
    @DisplayName("[PB-009] Estudiante NO inscrito no puede ver contenido (403 Forbidden)")
    @Disabled("Endpoint GET /api/courses/{id}/content no implementado")
    void nonEnrolledStudent_isForbidden() throws Exception {
        setupCourseWithContent();
        setupMockUser(studentId, "STUDENT");
        when(enrollmentService.isStudentEnrolled(eq(studentId), eq(courseId))).thenReturn(false);

        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("[PB-009] Estudiante INSCRITO puede ver contenido (200 OK)")
    @Disabled("Endpoint GET /api/courses/{id}/content no implementado")
    void enrolledStudent_canAccessContent() throws Exception {
        setupCourseWithContent();
        setupMockUser(studentId, "STUDENT");
        when(enrollmentService.isStudentEnrolled(eq(studentId), eq(courseId))).thenReturn(true);

        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.title", is("Curso de React Avanzado")))
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    @DisplayName("[PB-009] Instructor puede ver contenido (200 OK)")
    @Disabled("Endpoint GET /api/courses/{id}/content no implementado")
    void instructor_canAccessContent() throws Exception {
        setupCourseWithContent();
        setupMockUser(courseOwnerId, "INSTRUCTOR");

        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    @DisplayName("[PB-009] Admin puede ver contenido (200 OK)")
    @Disabled("Endpoint GET /api/courses/{id}/content no implementado")
    void admin_canAccessContent() throws Exception {
        setupCourseWithContent();
        setupMockUser(adminId, "ADMIN");

        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isOk())
               .andExpect(jsonPath("$.youtubeUrls", hasSize(2)));
    }

    @Test
    @DisplayName("[PB-009] Usuario anónimo no puede ver contenido (403 Forbidden)")
    @Disabled("Endpoint GET /api/courses/{id}/content no implementado")
    void anonymous_isForbidden() throws Exception {
        setupCourseWithContent();
        mockMvc.perform(get("/api/courses/{id}/content", courseId))
               .andExpect(status().isForbidden());
    }
}
