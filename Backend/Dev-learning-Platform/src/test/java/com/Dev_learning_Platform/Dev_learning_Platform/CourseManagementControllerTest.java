package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.DataInitializationService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties", properties = {
    "oci.objectstorage.namespace=dummy-namespace",
    "oci.objectstorage.bucket-name=dummy-bucket",
    "oci.objectstorage.region=dummy-region",
    "oci.objectstorage.public-url-base=https://dummy.com/",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@EnableMethodSecurity
@DisplayName("Pruebas para Edición y Eliminación de Cursos (PB-013)")
class CourseManagementControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CourseService courseService;

    @MockBean
    private UserService userService;

    @MockBean
    private DataInitializationService dataInitializationService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private final Long courseOwnerId = 1L;
    private final Long anotherInstructorId = 2L;
    private final Long adminId = 3L;
    private final Long studentId = 4L;
    private final Long courseId = 100L;

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

    // --- Tests para PUT /api/courses/{id} ---

    /*
     * =====================================================================================
     * NOTA: Los siguientes tests están comentados porque los métodos `updateCourse` y
     * `deleteCourse` aún no existen en la clase `CourseService`.
     * Se deben descomentar una vez que la funcionalidad esté implementada en el servicio.
     * =====================================================================================
     */

    // @Test
    // @DisplayName("Instructor propietario puede editar su curso (200 OK)")
    // void updateCourse_byOwner_shouldSucceed() throws Exception {
    //     // Arrange
    //     setupMockUser(courseOwnerId, "INSTRUCTOR");
    //     CourseCreateDto updateDto = new CourseCreateDto();
    //     updateDto.setTitle("Nuevo Título del Curso");

    //     Course updatedCourse = new Course();
    //     updatedCourse.setId(courseId);
    //     updatedCourse.setTitle("Nuevo Título del Curso");

    //     when(courseService.updateCourse(eq(courseId), any(CourseCreateDto.class), eq(courseOwnerId))).thenReturn(updatedCourse);

    //     // Act & Assert
    //     mockMvc.perform(put("/api/courses/{id}", courseId)
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .content(objectMapper.writeValueAsString(updateDto)))
    //             .andExpect(status().isOk())
    //             .andExpect(jsonPath("$.title").value("Nuevo Título del Curso"));
    // }

    // @Test
    // @DisplayName("Admin puede editar cualquier curso (200 OK)")
    // void updateCourse_byAdmin_shouldSucceed() throws Exception {
    //     // Arrange
    //     setupMockUser(adminId, "ADMIN");
    //     CourseCreateDto updateDto = new CourseCreateDto();
    //     updateDto.setTitle("Título Editado por Admin");

    //     Course updatedCourse = new Course();
    //     updatedCourse.setId(courseId);
    //     updatedCourse.setTitle("Título Editado por Admin");

    //     when(courseService.updateCourse(eq(courseId), any(CourseCreateDto.class), eq(adminId))).thenReturn(updatedCourse);

    //     // Act & Assert
    //     mockMvc.perform(put("/api/courses/{id}", courseId)
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .content(objectMapper.writeValueAsString(updateDto)))
    //             .andExpect(status().isOk());
    // }

    // @Test
    // @DisplayName("Instructor NO propietario no puede editar curso (403 Forbidden)")
    // void updateCourse_byNonOwner_shouldBeForbidden() throws Exception {
    //     // Arrange
    //     setupMockUser(anotherInstructorId, "INSTRUCTOR");
    //     CourseCreateDto updateDto = new CourseCreateDto();
    //     updateDto.setTitle("Intento de Edición");

    //     when(courseService.updateCourse(eq(courseId), any(CourseCreateDto.class), eq(anotherInstructorId)))
    //             .thenThrow(new SecurityException("No tienes permiso para editar este curso"));

    //     // Act & Assert
    //     mockMvc.perform(put("/api/courses/{id}", courseId)
    //                     .contentType(MediaType.APPLICATION_JSON)
    //                     .content(objectMapper.writeValueAsString(updateDto)))
    //             .andExpect(status().isForbidden());
    // }

    // // --- Tests para DELETE /api/courses/{id} ---

    // @Test
    // @DisplayName("Instructor propietario puede eliminar su curso (204 No Content)")
    // void deleteCourse_byOwner_shouldSucceed() throws Exception {
    //     // Arrange
    //     setupMockUser(courseOwnerId, "INSTRUCTOR");
    //     doNothing().when(courseService).deleteCourse(eq(courseId), eq(courseOwnerId));

    //     // Act & Assert
    //     mockMvc.perform(delete("/api/courses/{id}", courseId))
    //             .andExpect(status().isNoContent());
    // }

    // @Test
    // @DisplayName("Estudiante no puede eliminar un curso (403 Forbidden)")
    // void deleteCourse_byStudent_shouldBeForbidden() throws Exception {
    //     // Arrange
    //     setupMockUser(studentId, "STUDENT");

    //     // Act & Assert
    //     mockMvc.perform(delete("/api/courses/{id}", courseId))
    //             .andExpect(status().isForbidden());
    // }

    // @Test
    // @DisplayName("Falla al eliminar curso con inscripciones existentes (409 Conflict)")
    // void deleteCourse_withExistingEnrollments_shouldReturnConflict() throws Exception {
    //     // Arrange
    //     setupMockUser(courseOwnerId, "INSTRUCTOR");
    //     doThrow(new IllegalStateException("No se puede eliminar un curso con estudiantes inscritos"))
    //             .when(courseService).deleteCourse(eq(courseId), eq(courseOwnerId));

    //     // Act & Assert
    //     mockMvc.perform(delete("/api/courses/{id}", courseId))
    //             .andExpect(status().isConflict());
    // }
}
