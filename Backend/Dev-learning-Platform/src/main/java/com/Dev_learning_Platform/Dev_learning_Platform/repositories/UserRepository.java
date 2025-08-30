package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

/**
 * Repositorio para operaciones de base de datos relacionadas con usuarios.
 * 
 * Extiende JpaRepository para operaciones CRUD básicas y define queries personalizadas
 * para lógica de negocio específica de usuarios.
 * 
 * Funcionalidades principales:
 * - Operaciones CRUD básicas heredadas de JpaRepository
 * - Búsqueda de usuarios por email (para autenticación)
 * - Integración con Spring Security para UserDetailsService
 * 
 * Métodos disponibles:
 * - save(User): Guardar o actualizar usuario
 * - findById(Long): Buscar usuario por ID
 * - findAll(): Obtener todos los usuarios
 * - delete(User): Eliminar usuario
 * - findByEmail(String): Buscar usuario por email (método personalizado)
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Busca un usuario por su dirección de email.
     * 
     * Este método es crucial para la autenticación ya que el email se usa
     * como identificador único para el login. Spring Security lo utiliza
     * a través del UserDetailsService.
     * 
     * @param email La dirección de email del usuario a buscar
     * @return Optional que contiene el usuario si existe, vacío si no
     */
    Optional<User> findByEmail(String email);
}
