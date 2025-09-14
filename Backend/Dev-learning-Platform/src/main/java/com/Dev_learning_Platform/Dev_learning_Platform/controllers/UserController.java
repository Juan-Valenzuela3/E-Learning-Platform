package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.ErrorResponseDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.UserRegisterDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.profile.UpdateProfileDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.profile.UserProfileDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.FileUploadService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final FileUploadService fileUploadService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserRegisterDto userDto) {
        log.info("Intentando registrar usuario con email: {}", userDto.getEmail());
        
        try {
            // Verificar si el email ya existe
            User existingUser = userService.findByEmail(userDto.getEmail());
            if (existingUser != null) {
                log.warn("Email ya registrado: {}", userDto.getEmail());
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ErrorResponseDto.simple("EMAIL_ALREADY_EXISTS", 
                          "El email ya está registrado en el sistema",
                          "/api/users/register"));
            }

            // Crear y guardar nuevo usuario
            User newUser = userService.saveUser(UserRegisterDto.toEntity(userDto));
            log.info("Usuario registrado exitosamente con ID: {}", newUser.getId());
            
            return ResponseEntity.ok(newUser);
            
        } catch (Exception e) {
            log.error("Error al registrar usuario: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponseDto.simple("REGISTRATION_ERROR", 
                      "Error interno del servidor al registrar usuario",
                      "/api/users/register"));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable User.Role role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @GetMapping("all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<UserProfileDto> getCurrentUserProfile(Principal principal) {
        log.info("Obteniendo perfil para usuario: {}", principal.getName());
        
        User currentUser = userService.findByEmail(principal.getName());
        UserProfileDto profileDto = UserProfileDto.fromEntity(currentUser);
        
        return ResponseEntity.ok(profileDto);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<UserProfileDto> updateCurrentUserProfile(
            @Valid @RequestBody UpdateProfileDto updateProfileDto, 
            Principal principal) {
        
        log.info("Actualizando perfil para usuario: {}", principal.getName());
        
        User currentUser = userService.findByEmail(principal.getName());
        User updatedUser = userService.updateUserProfile(currentUser.getId(), updateProfileDto);
        UserProfileDto profileDto = UserProfileDto.fromEntity(updatedUser);
        
        log.info("Perfil actualizado exitosamente para usuario: {}", principal.getName());
        return ResponseEntity.ok(profileDto);
    }

    /**
     * FUNCIONALIDAD OPCIONAL: "Como usuario quiero cargar mi imagen de perfil"
     * Sube una imagen de perfil para el usuario autenticado.
     * 
     * @param file Archivo de imagen a subir
     * @param principal Usuario autenticado
     * @return ResponseEntity con el perfil actualizado incluyendo la nueva imagen
     */
    @PostMapping("/profile/upload-image")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<UserProfileDto> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            Principal principal) {
        
        log.info("Subiendo imagen de perfil para usuario: {}", principal.getName());
        
        try {
            User currentUser = userService.findByEmail(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.notFound().build();
            }

            if (currentUser.getProfileImageUrl() != null) {
                fileUploadService.deleteProfileImage(currentUser.getProfileImageUrl());
            }

            String imageUrl = fileUploadService.uploadProfileImage(file, currentUser.getId());

            User updatedUser = userService.updateProfileImage(currentUser.getId(), imageUrl);
            UserProfileDto profileDto = UserProfileDto.fromEntity(updatedUser);
            
            log.info("Imagen de perfil actualizada exitosamente para usuario: {}", principal.getName());
            return ResponseEntity.ok(profileDto);
            
        } catch (IllegalArgumentException e) {
            log.error("Archivo inválido: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            log.error("Error al subir archivo: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
