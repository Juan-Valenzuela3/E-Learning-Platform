package com.Dev_learning_Platform.Dev_learning_Platform;


import com.Dev_learning_Platform.Dev_learning_Platform.controllers.EnrollmentController;
import com.Dev_learning_Platform.Dev_learning_Platform.middlewares.JwtAuthenticationFilter;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
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


import java.util.List;
import java.util.Optional;


import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(EnrollmentController.class)
@ActiveProfiles("test")
@EnableMethodSecurity
@DisplayName("Pruebas para EnrollmentController (Gestión de Inscripciones)")
class EnrollmentControllerTest {


    private final Long studentId = 1L;
    private final Long anotherStudentId = 2L;
    private final Long instructorId = 3L;
    private final Long courseId = 50L;
    private final Long enrollmentId = 100L;
    private final Long nonExistentEnrollmentId = 999L;


    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;


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
        // ESTA LÍNEA ES CRUCIAL: Simula la llamada que hace el controlador para obtener el usuario.
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

    // --- Tests para POST /api/enrollments ---

    @Test
    @DisplayName("Estudiante puede inscribirse a un curso (201 Created)")
    void enroll_whenStudentAndCourseExist_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");

        Enrollment newEnrollment = new Enrollment();
        newEnrollment.setId(enrollmentId);

        when(enrollmentService.enrollStudent(any(Long.class), any(Long.class))).thenReturn(newEnrollment);

        // Act & Assert
        mockMvc.perform(post("/api/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\": " + courseId + "}")
                        .with(csrf()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(enrollmentId));
    }

    @Test
    @DisplayName("Falla si estudiante ya está inscrito (409 Conflict)")
    void enroll_whenAlreadyEnrolled_shouldReturnConflict() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        // El controlador captura IllegalArgumentException y devuelve 400 Bad Request.
        when(enrollmentService.enrollStudent(any(Long.class), any(Long.class)))
                .thenThrow(new IllegalArgumentException("Ya estás inscrito en este curso"));

        // Act & Assert
        mockMvc.perform(post("/api/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\": " + courseId + "}")
                        .with(csrf()))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Instructor no puede inscribirse a un curso (403 Forbidden)")
    void enroll_whenUserIsInstructor_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(instructorId, "INSTRUCTOR");

        // Act & Assert
        mockMvc.perform(post("/api/enrollments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"courseId\": " + courseId + "}")
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    // --- Tests para GET /api/enrollments/my-courses ---

    @Test
    @DisplayName("Estudiante puede ver sus cursos inscritos (200 OK)")
    void getMyCourses_whenStudentIsAuthenticated_shouldReturnCourses() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        
        Enrollment enrollment1 = new Enrollment();
        enrollment1.setId(101L);
        Enrollment enrollment2 = new Enrollment();
        enrollment2.setId(102L);

        // El endpoint /my-courses devuelve una lista de Enrollment, no de Course.
        when(enrollmentService.getActiveStudentEnrollments(studentId)).thenReturn(List.of(enrollment1, enrollment2));

        // Act & Assert
        mockMvc.perform(get("/api/enrollments/my-courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(101)));
    }

    // --- Tests para PUT /api/enrollments/{id}/progress ---

    @Test
    @DisplayName("Estudiante puede actualizar el progreso de su inscripción (200 OK)")
    void updateProgress_whenStudentOwnsEnrollment_shouldSucceed() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        // Usamos la clase interna estática del controlador
        EnrollmentController.ProgressUpdateRequest progressUpdateDto = new EnrollmentController.ProgressUpdateRequest();
        progressUpdateDto.setProgressPercentage(50);

        Enrollment updatedEnrollment = new Enrollment();
        updatedEnrollment.setId(enrollmentId);
        updatedEnrollment.setProgressPercentage(50);

        // El controlador primero busca la inscripción para validar la propiedad.
        Enrollment existingEnrollment = new Enrollment();
        User owner = new User();
        owner.setId(studentId);
        existingEnrollment.setStudent(owner);
        when(enrollmentService.getEnrollmentById(enrollmentId)).thenReturn(Optional.of(existingEnrollment));

        when(enrollmentService.updateProgress(eq(enrollmentId), eq(50)))
                .thenReturn(updatedEnrollment);

        // Act & Assert
        mockMvc.perform(put("/api/enrollments/{id}/progress", enrollmentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(progressUpdateDto))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.progressPercentage").value(50));
    }

    @Test
    @DisplayName("Falla si estudiante actualiza progreso de inscripción ajena (403 Forbidden)")
    void updateProgress_whenStudentDoesNotOwnEnrollment_shouldBeForbidden() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT"); // Autenticado como estudiante 1
        EnrollmentController.ProgressUpdateRequest progressUpdateDto = new EnrollmentController.ProgressUpdateRequest();
        progressUpdateDto.setProgressPercentage(50);

        // El controlador valida la propiedad, por lo que simulamos que la inscripción no pertenece al usuario
        Enrollment otherEnrollment = new Enrollment();
        otherEnrollment.setStudent(new User());
        otherEnrollment.getStudent().setId(anotherStudentId); // ID de otro estudiante
        when(enrollmentService.getEnrollmentById(enrollmentId)).thenReturn(Optional.of(otherEnrollment));

        // Act & Assert
        mockMvc.perform(put("/api/enrollments/{id}/progress", enrollmentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(progressUpdateDto))
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    // --- Tests para DELETE /api/enrollments/{id} ---

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

        // El servicio se encarga de la lógica de validación y eliminación
        // El controlador llama a userService.findById para obtener el objeto del usuario actual
        when(userService.findById(studentId)).thenReturn(student);
        when(enrollmentService.getEnrollmentById(enrollmentId)).thenReturn(Optional.of(enrollment));
        doNothing().when(enrollmentService).unenrollStudent(eq(enrollmentId));


        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", enrollmentId).with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Te has desinscrito exitosamente del curso"));
    }


    @Test
    @DisplayName("Falla al intentar desinscribirse de una inscripción inexistente (404 Not Found)")
    void unenroll_whenEnrollmentNotFound_shouldReturnNotFound() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT");
        // El controlador busca primero la inscripción. Simulamos que no la encuentra.
        when(enrollmentService.getEnrollmentById(nonExistentEnrollmentId)).thenReturn(Optional.empty());


        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", nonExistentEnrollmentId).with(csrf()))
                .andExpect(status().isNotFound());
    }


    @Test
    @DisplayName("Falla si estudiante intenta desinscribirse de una inscripción ajena (403 Forbidden)")
    void unenroll_whenStudentDoesNotOwnEnrollment_shouldReturnForbidden() throws Exception {
        // Arrange
        setupMockUser(studentId, "STUDENT"); // Autenticado como estudiante 1
        
        // Simulamos que la inscripción pertenece a otro estudiante
        Enrollment otherEnrollment = new Enrollment();
        otherEnrollment.setStudent(new User());
        otherEnrollment.getStudent().setId(anotherStudentId);
        // El controlador necesita al usuario actual para la comparación
        // La simulación debe devolver un usuario con el ID correcto para evitar NullPointerException.
        User currentUser = new User();
        currentUser.setId(studentId);
        when(userService.findById(studentId)).thenReturn(currentUser);
        
        when(enrollmentService.getEnrollmentById(enrollmentId)).thenReturn(Optional.of(otherEnrollment));


        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", enrollmentId).with(csrf()))
                .andExpect(status().isForbidden());
    }


    @Test
    @DisplayName("Falla si un instructor intenta desinscribirse (403 Forbidden)")
    void unenroll_whenUserIsInstructor_shouldReturnForbidden() throws Exception {
        // Arrange
        setupMockUser(instructorId, "INSTRUCTOR");

        // Act & Assert
        mockMvc.perform(delete("/api/enrollments/{id}", enrollmentId).with(csrf()))
                .andExpect(status().isForbidden());
    }
}
