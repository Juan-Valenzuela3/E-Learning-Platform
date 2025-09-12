package com.Dev_learning_Platform.Dev_learning_Platform;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.Dev_learning_Platform.Dev_learning_Platform.services.CustomUserDetailsService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.auth.JwtService;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@SuppressWarnings("removal") // Para suprimir warnings de @MockBean deprecated
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserService userService;

    @MockBean
    private CustomUserDetailsService userDetailsService;

    @MockBean
    private JwtService jwtService;

    @Test
    void loginSuccess() throws Exception {
        // Preparar datos de prueba
        UserDetails userDetails = User.builder()
                .username("test@example.com")
                .password("password")
                .roles("USER")
                .build();

        com.Dev_learning_Platform.Dev_learning_Platform.models.User user = 
            new com.Dev_learning_Platform.Dev_learning_Platform.models.User();
        user.setId(1L);
        user.setUserName("Test User");
        user.setEmail("test@example.com");
        user.setRole(com.Dev_learning_Platform.Dev_learning_Platform.models.User.Role.STUDENT);
        user.setActive(true);

        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null); // Simulamos autenticación exitosa

        // Mock de los servicios
        Mockito.when(userDetailsService.loadUserByUsername("test@example.com"))
                .thenReturn(userDetails);
        Mockito.when(userService.findByEmail("test@example.com"))
                .thenReturn(user);
        Mockito.when(jwtService.generateToken(userDetails)).thenReturn("fake-jwt-token");

        // Ejecutar y verificar
        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void validateTokenSuccess() throws Exception {
        UserDetails userDetails = User.builder()
                .username("test@example.com")
                .password("password")
                .roles("USER")
                .build();

        Mockito.when(jwtService.extractUsername("fake-jwt")).thenReturn("test@example.com");
        Mockito.when(userDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        Mockito.when(jwtService.validateToken("fake-jwt", userDetails)).thenReturn(true);

        mockMvc.perform(get("/auth/validate")
                .param("token", "fake-jwt"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.username").value("test@example.com"));
    }
}
