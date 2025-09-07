package com.Dev_learning_Platform.Dev_learning_Platform;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.Dev_learning_Platform.Dev_learning_Platform.controllers.AuthController;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CustomUserDetailsService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.auth.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserService userService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthController authController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders.standaloneSetup(authController).build();
    }

    @Test
    void loginSuccess() throws Exception {

        UserDetails userDetails = User.builder()
                .username("test@example.com")
                .password("password")
                .roles("USER")
                .build();

        Mockito.when(userDetailsService.loadUserByUsername("test@example.com"))
                .thenReturn(userDetails);
        Mockito.when(userService.findByEmail("test@example.com"))
                .thenReturn(new com.Dev_learning_Platform.Dev_learning_Platform.models.User());
        Mockito.when(jwtService.generateToken(userDetails)).thenReturn("fake-jwt-token");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake-jwt-token"));
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
                .andExpect(jsonPath("$.valid").value(true));
    }
}
