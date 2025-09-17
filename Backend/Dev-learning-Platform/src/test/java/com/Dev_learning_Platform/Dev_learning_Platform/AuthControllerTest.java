package com.Dev_learning_Platform.Dev_learning_Platform;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; // <- agrega esto
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import com.Dev_learning_Platform.Dev_learning_Platform.controllers.AuthController;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CustomUserDetailsService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.auth.JwtService;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) // ⬅️ desactiva filtros/seguridad en el slice
@ActiveProfiles("test")
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
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@example.com")
                .password("password")
                .authorities("ROLE_STUDENT")
                .build();

        User user = new User();
        user.setId(1L);
        user.setUserName("Test User");
        user.setEmail("test@example.com");
        user.setRole(User.Role.STUDENT);
        user.setActive(true);

        Authentication auth = new UsernamePasswordAuthenticationToken(
                userDetails, "password", userDetails.getAuthorities());

        Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(auth);

        Mockito.when(userDetailsService.loadUserByUsername("test@example.com"))
                .thenReturn(userDetails);
        Mockito.when(userService.findByEmail("test@example.com"))
                .thenReturn(user);
        Mockito.when(jwtService.generateToken(userDetails)).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"test@example.com\",\"password\":\"password\"}")
                        .with(csrf())) // si no tienes spring-security-test en el classpath, elimina ".with(csrf())"
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void validateTokenSuccess() throws Exception {
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username("test@example.com")
                .password("password")
                .authorities("ROLE_STUDENT")
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
