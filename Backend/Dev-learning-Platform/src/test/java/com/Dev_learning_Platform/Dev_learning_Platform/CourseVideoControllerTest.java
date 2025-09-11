package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseVideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;
import com.Dev_learning_Platform.Dev_learning_Platform.services.DataInitializationService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseVideoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties", properties = {
    // Proporcionamos valores dummy para las propiedades de OCI que son requeridas
    // para que el contexto de Spring pueda cargar durante las pruebas.
    "oci.objectstorage.namespace=dummy-namespace",
    "oci.objectstorage.bucket-name=dummy-bucket",
    "oci.objectstorage.region=dummy-region",
    "oci.objectstorage.public-url-base=https://dummy.com/",
    // Aseguramos que el esquema de la BD (tablas) se cree al iniciar el test.
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@EnableMethodSecurity
@DisplayName("Pruebas para Gestión de Videos del Curso (PB-007)")
class CourseVideoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CourseVideoService courseVideoService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter; // Neutralizamos el filtro JWT

    // Mockeamos el servicio de inicialización para evitar que se ejecute
    // y trate de acceder a la base de datos durante el arranque del test.
    @MockBean
    private DataInitializationService dataInitializationService;

    private final Long courseOwnerId = 1L;
    private final Long anotherInstructorId = 2L;
    private final Long studentId = 3L;
    private final Long courseId = 10L;
    private final Long videoId = 100L;

    // ---------- HELPERS ----------

    private void setupMockUser(Long userId, String role) {
        // Creamos un objeto User completo para simular el principal de la autenticación.
        // Esto es más robusto y realista que usar solo un String.
        User principal = new User();
        principal.setId(userId);
        principal.setRole(User.Role.valueOf(role));
        principal.setEmail(role.toLowerCase() + "@example.com");

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(
                principal, // El principal ahora es el objeto User
                null, // No se necesitan credenciales en este punto
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        ));
        SecurityContextHolder.setContext(ctx);
    }

    private CourseVideoDto createVideoDto(String url) {
        CourseVideoDto dto = new CourseVideoDto();
        dto.setCourseId(courseId);
        dto.setTitle("Nuevo Video");
        dto.setYoutubeUrl(url);
        return dto;
    }

    @AfterEach
    void tearDown() {
        // Limpiamos el contexto de seguridad después de cada prueba para evitar interferencias.
        SecurityContextHolder.clearContext();
    }

    // ---------- ADD VIDEO TESTS (POST /api/course-videos) ----------

    @Test
    @DisplayName("Instructor propietario puede agregar un video (201 Created)")
    void addVideo_byCourseOwner_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        CourseVideoDto videoDto = createVideoDto("https://www.youtube.com/watch?v=valid_id");
        CourseVideo createdVideo = new CourseVideo();
        createdVideo.setId(videoId);
        createdVideo.setTitle(videoDto.getTitle());

        when(courseVideoService.addVideoToCourse(any(CourseVideoDto.class), eq(courseOwnerId))).thenReturn(createdVideo);

        // Act & Assert
        mockMvc.perform(post("/api/course-videos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(videoDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(videoId))
                .andExpect(jsonPath("$.title").value("Nuevo Video"));
    }

    @Test
    @DisplayName("Instructor NO propietario no puede agregar video (403 Forbidden)")
    void addVideo_byAnotherInstructor_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(anotherInstructorId, "INSTRUCTOR");
        CourseVideoDto videoDto = createVideoDto("https://www.youtube.com/watch?v=valid_id");

        // El servicio lanzará una excepción de seguridad si el ID del instructor no coincide
        when(courseVideoService.addVideoToCourse(any(CourseVideoDto.class), eq(anotherInstructorId)))
                .thenThrow(new SecurityException("Solo el instructor del curso puede agregar videos"));

        // Act & Assert
        mockMvc.perform(post("/api/course-videos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(videoDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Estudiante no puede agregar video (403 Forbidden)")
    void addVideo_byStudent_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        CourseVideoDto videoDto = createVideoDto("https://www.youtube.com/watch?v=valid_id");

        // Act & Assert
        // La anotación @PreAuthorize("hasRole('INSTRUCTOR')") en el controlador debe bloquear esto
        mockMvc.perform(post("/api/course-videos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(videoDto)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Agregar video con URL inválida falla (400 Bad Request)")
    void addVideo_withInvalidUrl_shouldFail() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        CourseVideoDto videoDto = createVideoDto("https://not-a-youtube-url.com");

        when(courseVideoService.addVideoToCourse(any(CourseVideoDto.class), eq(courseOwnerId)))
                .thenThrow(new IllegalArgumentException("URL de YouTube inválida"));

        // Act & Assert
        mockMvc.perform(post("/api/course-videos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(videoDto)))
                .andExpect(status().isBadRequest());
    }

    // ---------- DELETE VIDEO TESTS (DELETE /api/course-videos/{videoId}) ----------

    @Test
    @DisplayName("Instructor propietario puede eliminar un video (204 No Content)")
    void deleteVideo_byCourseOwner_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(courseOwnerId, "INSTRUCTOR");
        doNothing().when(courseVideoService).deleteVideo(eq(videoId), eq(courseOwnerId));

        // Act & Assert
        mockMvc.perform(delete("/api/course-videos/{videoId}", videoId))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("Instructor NO propietario no puede eliminar video (403 Forbidden)")
    void deleteVideo_byAnotherInstructor_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(anotherInstructorId, "INSTRUCTOR");
        doThrow(new SecurityException("Solo el instructor del curso puede eliminar videos"))
                .when(courseVideoService).deleteVideo(eq(videoId), eq(anotherInstructorId));

        // Act & Assert
        mockMvc.perform(delete("/api/course-videos/{videoId}", videoId))
                .andExpect(status().isForbidden());
    }
}
