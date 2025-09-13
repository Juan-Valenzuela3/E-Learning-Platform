package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.controllers.CourseVideoController;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseVideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseVideoService;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(CourseVideoController.class)
@ActiveProfiles("test")
@EnableMethodSecurity
@DisplayName("Pruebas para Gestión de Videos del Curso (PB-007)")
class CourseVideoControllerTest {

    private final Long courseOwnerId = 1L;
    private final Long anotherInstructorId = 2L;
    private final Long studentId = 3L;
    private final Long courseId = 10L;
    private final Long videoId = 100L;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CourseVideoService courseVideoService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    // ---------- HELPERS ----------

    private void setupMockUser(Long userId, String role) {
        String email = role.toLowerCase() + userId + "@example.com";
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(email)
                .password("password")
                .authorities("ROLE_" + role)
                .build();

        SecurityContext ctx = SecurityContextHolder.createEmptyContext();
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(
                userDetails,
                null, // No se necesitan credenciales en este punto
                userDetails.getAuthorities()
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
