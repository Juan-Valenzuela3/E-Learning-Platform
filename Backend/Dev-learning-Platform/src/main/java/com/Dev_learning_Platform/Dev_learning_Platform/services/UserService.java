package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.UserRegisterDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

/**
 * Servicio para gestionar operaciones relacionadas con usuarios.
 * 
 * Este servicio maneja toda la lógica de negocio relacionada con usuarios:
 * - Registro de nuevos usuarios
 * - Búsqueda y validación de usuarios
 * - Encriptación de contraseñas
 * - Gestión de roles y estados de usuario
 * 
 * Características de seguridad:
 * - Encriptación automática de contraseñas con BCrypt
 * - Validación de emails únicos
 * - Asignación automática de roles por defecto
 * - Control de estado activo/inactivo
 * 
 * Integración:
 * - Con Spring Security para autenticación
 * - Con RefreshTokenService para gestión de sesiones
 * - Con CustomUserDetailsService para carga de usuarios
 */
@Service
public class UserService {

    /**
     * Repositorio para operaciones de base de datos con usuarios
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Encoder de contraseñas usando BCrypt.
     * BCrypt es un algoritmo de hashing seguro que incluye salt automático.
     * Se usa para encriptar contraseñas antes de almacenarlas en la base de datos.
     */
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Guarda un usuario en la base de datos.
     * 
     * Este método encripta automáticamente la contraseña del usuario
     * usando BCrypt antes de guardarlo en la base de datos.
     * 
     * @param user El usuario a guardar
     * @return El usuario guardado con la contraseña encriptada
     */
    public User saveUser(User user) {
        // Encriptar la contraseña antes de guardar para seguridad
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    /**
     * Busca un usuario por su dirección de email.
     * 
     * Este método es usado principalmente para autenticación y
     * lanza una excepción si el usuario no existe.
     * 
     * @param email La dirección de email del usuario a buscar
     * @return El usuario encontrado
     * @throws RuntimeException si el usuario no existe
     */
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
    }

    /**
     * Registra un nuevo usuario en el sistema.
     * 
     * Este método implementa la lógica completa de registro:
     * 1. Verifica que el email no esté ya registrado
     * 2. Crea un nuevo usuario con los datos proporcionados
     * 3. Asigna el rol por defecto (STUDENT)
     * 4. Activa el usuario
     * 5. Encripta la contraseña y guarda el usuario
     * 
     * @param registerDto DTO con los datos de registro del usuario
     * @return El usuario registrado y guardado
     * @throws RuntimeException si el email ya está registrado
     */
    public User registerUser(UserRegisterDto registerDto) {
        // Verificar que el email no esté ya registrado
        if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario con datos del DTO
        User user = new User();
        user.setUserName(registerDto.getUserName());
        user.setLastName(registerDto.getLastName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(registerDto.getPassword()); // Se encriptará en saveUser()
        // Asignar rol: usar el del DTO si se proporciona, sino usar STUDENT por defecto
        user.setRole(registerDto.getRole() != null ? registerDto.getRole() : User.Role.STUDENT);

        user.setActive(true); // Activar usuario por defecto

        return saveUser(user); // Guardar y encriptar contraseña
    }

    /**
     * Obtiene todos los usuarios registrados en el sistema.
     * 
     * @return Lista de todos los usuarios (sin contraseñas)
     */
    public List<User> getAllUsers() {
        List<User> users = userRepository.findAll();
        // Por seguridad, no retornar contraseñas
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    /**
     * Elimina un usuario por su ID.
     * Solo los administradores pueden eliminar usuarios.
     * 
     * @param userId ID del usuario a eliminar
     * @param adminUser Usuario administrador que realiza la eliminación
     * @throws RuntimeException si el usuario no existe o no es admin
     */
    public void deleteUser(Long userId, User adminUser) {
        // Verificar que el usuario que ejecuta la acción sea ADMIN
        if (adminUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden eliminar usuarios");
        }

        // Verificar que el usuario a eliminar existe
        User userToDelete = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        // Verificar que no se elimine a sí mismo
        if (userToDelete.getId().equals(adminUser.getId())) {
            throw new RuntimeException("No puedes eliminar tu propia cuenta");
        }

        // Eliminar refresh tokens del usuario
        // refreshTokenService.revokeAllUserTokens(userId);

        // Eliminar el usuario
        userRepository.delete(userToDelete);
    }

    /**
     * Busca un usuario por su ID.
     * 
     * @param userId ID del usuario a buscar
     * @return El usuario encontrado
     * @throws RuntimeException si el usuario no existe
     */
    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));
    }

    /**
     * Cambia el rol de un usuario.
     * Solo los administradores pueden cambiar roles.
     * 
     * @param userId ID del usuario cuyo rol se va a cambiar
     * @param newRole Nuevo rol a asignar
     * @param adminUser Usuario administrador que realiza el cambio
     * @return El usuario actualizado
     * @throws RuntimeException si el usuario no existe, no es admin, o intenta cambiar su propio rol
     */
    public User changeUserRole(Long userId, User.Role newRole, User adminUser) {
        // Verificar que el usuario que ejecuta la acción sea ADMIN
        if (adminUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Solo los administradores pueden cambiar roles de usuarios");
        }

        // Verificar que el usuario a modificar existe
        User userToModify = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + userId));

        // Verificar que no se cambie el rol del propio admin
        if (userToModify.getId().equals(adminUser.getId())) {
            throw new RuntimeException("No puedes cambiar tu propio rol");
        }

        // Cambiar el rol
        userToModify.setRole(newRole);
        
        // Guardar cambios
        return userRepository.save(userToModify);
    }
}
