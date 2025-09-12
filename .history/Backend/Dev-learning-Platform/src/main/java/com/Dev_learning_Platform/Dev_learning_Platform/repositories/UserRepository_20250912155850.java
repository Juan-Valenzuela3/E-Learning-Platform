package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    List<User> findByRole(User.Role role);
    Boolean existsByEmail(String email);
    Optional<User> findByUserName(String userName);
    
    // Métodos para estadísticas de administración
    Long countByRole(User.Role role);
    Long countByIsActive(boolean isActive);
    Long countByCreatedAtAfter(Timestamp timestamp);
    Long countByCreatedAtBetween(Timestamp start, Timestamp end);
}
