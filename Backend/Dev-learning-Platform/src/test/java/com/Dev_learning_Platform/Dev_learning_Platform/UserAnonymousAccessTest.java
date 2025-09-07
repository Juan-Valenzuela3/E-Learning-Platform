package com.Dev_learning_Platform.Dev_learning_Platform;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class UserAnonymousAccessTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void anonymous_cannot_access_users_should_be_403() throws Exception {
        // This test runs without mocking the JwtAuthenticationFilter.
        // We expect the real security filter to run, find no token, and deny access.
        // Spring Security's default for role-based access denial is 403 Forbidden.
        mockMvc.perform(get("/api/users/all"))
                .andExpect(status().isForbidden());
    }

    @Test
    void anonymous_cannot_create_course_should_be_403() throws Exception {
        // Arrange: Creamos un cuerpo de petición válido.
        // El test debe fallar por falta de autorización (403), no por datos inválidos (400).
        // Para ello, el DTO debe pasar la validación, incluyendo campos requeridos como instructorId.
        String validCourseDtoJson = "{" +
                "\"title\": \"Attempted Course Creation\"," +
                "\"description\": \"A course an anonymous user tries to create.\"," +
                "\"shortDescription\": \"Short desc.\"," +
                "\"instructorId\": 1," +
                "\"price\": 10.00" +
                "}";

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(validCourseDtoJson))
                .andExpect(status().isForbidden());
    }
}