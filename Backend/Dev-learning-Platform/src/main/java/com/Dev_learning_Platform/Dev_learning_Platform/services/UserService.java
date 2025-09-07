package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.profile.UpdateProfileDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {
    
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Transactional
    public User saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con ID: " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Obtiene usuario filtrados por rol, solo para uso administrativo
    public List<User> getUsersByRole(User.Role role) {
        return userRepository.findByRole(role);
    }

    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email) != null;
    }

    @Transactional
    public User updateUserProfile(Long userId, UpdateProfileDto updateProfileDto) {
        User user = findById(userId);

        if (!user.getEmail().equals(updateProfileDto.getEmail())) {
            User existingUser = findByEmail(updateProfileDto.getEmail());
            if (existingUser != null && !existingUser.getId().equals(userId)) {
                throw new IllegalArgumentException("El email ya está en uso por otro usuario");
            }
        }

        user.setUserName(updateProfileDto.getUserName());
        user.setLastName(updateProfileDto.getLastName());
        user.setEmail(updateProfileDto.getEmail());
        
        // Actualixar imagen de perfil solo si se proporciona
        if (updateProfileDto.getProfileImageUrl() != null && !updateProfileDto.getProfileImageUrl().trim().isEmpty()) {
            user.setProfileImageUrl(updateProfileDto.getProfileImageUrl());
        }

        return userRepository.save(user);
    }

    @Transactional
    public User updateProfileImage(Long userId, String imageUrl) {
        log.info("Actualizando imagen de perfil para usuario ID: {}", userId);
        
        User user = findById(userId);
        user.setProfileImageUrl(imageUrl);
        
        User savedUser = userRepository.save(user);
        log.info("Imagen de perfil actualizada exitosamente");
        
        return savedUser;
    }
}
