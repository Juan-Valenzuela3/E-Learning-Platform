package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.DataInitializationService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
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
@DisplayName("Pruebas para Desinscripción de Cursos (PB-014)")
class EnrollmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EnrollmentService enrollmentService;

    @MockBean
    private UserService userService;

    @MockBean
    private DataInitializationService dataInitializationService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private final Long studentId = 1L;
    private final Long anotherStudentId = 2L;
    private final Long instructorId = 3L;
    private final Long enrollmentId = 100L;
    private final Long nonExistentEnrollmentId = 999L;

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
        ctx.setAuthentication(new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
        ));
        SecurityContextHolder.setContext(ctx);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Estudiante puede desinscribirse de su propia inscripción (200 OK)")
    void unenroll_whenStudentOwnsEnrollment_shouldReturnOk() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");

        User student = new User();
        student.setId(studentId);

        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStudent(student);

        when(enrollmentService.getEnrollmentById(enrollmentId)).thenReturn(Optional.of(enrollment));
        doNothing().when(enrollmentService).unenrollStudent(enrollmentId);

        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", enrollmentId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Te has desinscrito exitosamente del curso"));
    }

    @Test
    @DisplayName("Falla al intentar desinscribirse de una inscripción inexistente (404 Not Found)")
    void unenroll_whenEnrollmentNotFound_shouldReturnNotFound() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        when(enrollmentService.getEnrollmentById(nonExistentEnrollmentId)).thenReturn(Optional.empty());

        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", nonExistentEnrollmentId))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Falla si estudiante intenta desinscribirse de una inscripción ajena (403 Forbidden)")
    void unenroll_whenStudentDoesNotOwnEnrollment_shouldReturnForbidden() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT"); // Autenticado como estudiante 1

        User anotherStudent = new User();
        anotherStudent.setId(anotherStudentId); // La inscripción pertenece al estudiante 2

        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStudent(anotherStudent);

        when(enrollmentService.getEnrollmentById(enrollmentId)).thenReturn(Optional.of(enrollment));

        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", enrollmentId))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("No tienes permisos para desinscribirte de este curso"));
    }

    @Test
    @DisplayName("Falla si un instructor intenta desinscribirse (403 Forbidden)")
    void unenroll_whenUserIsInstructor_shouldReturnForbidden() throws Exception {
        // Arrange
        setupMockUser(instructorId, "INSTRUCTOR");

        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", enrollmentId))
                .andExpect(status().isForbidden());
    }
}
