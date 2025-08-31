package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

/**
 * Inicializador de datos simplificado para la aplicación.
 * 
 * Este componente se ejecuta al iniciar la aplicación y crea:
 * - Un usuario administrador por defecto
 * - Datos de prueba si es necesario
 * 
 * Características:
 * - Se ejecuta solo una vez al iniciar la aplicación
 * - Verifica si los datos ya existen antes de crearlos
 * - Crea un admin por defecto con credenciales conocidas
 * - Permite testing inmediato de funcionalidades de admin
 * 
 * Credenciales del admin por defecto:
 * - Email: admin@system.com
 * - Contraseña: admin123
 * - Rol: ADMIN
 */
@Component
@Transactional
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("🚀 Iniciando inicialización de datos...");
            
            long startTime = System.currentTimeMillis();
            
            initializeDefaultAdmin();
            initializeSampleUsers();
            
            long endTime = System.currentTimeMillis();
            long duration = endTime - startTime;
            
            System.out.println("✅ Datos inicializados correctamente en " + duration + "ms");
            
        } catch (Exception e) {
            System.err.println("❌ Error crítico durante la inicialización: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Inicializa el usuario administrador por defecto.
     */
    @Transactional
    private void initializeDefaultAdmin() {
        try {
            System.out.println("🔍 Verificando existencia del admin por defecto...");
            
            // Verificar si ya existe el admin
            if (userRepository.findByEmail("admin@system.com").isPresent()) {
                System.out.println("ℹ️  Admin por defecto ya existe");
                return;
            }

            System.out.println("👤 Creando usuario administrador por defecto...");
            
            // Crear usuario admin
            User admin = new User();
            admin.setUserName("Administrador");
            admin.setLastName("Sistema");
            admin.setEmail("admin@system.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);

            // Guardar admin
            userRepository.save(admin);
            System.out.println("✅ Admin por defecto creado:");
            System.out.println("   📧 Email: admin@system.com");
            System.out.println("   🔑 Contraseña: admin123 (encriptada)");
            System.out.println("   👤 Rol: ADMIN");

        } catch (Exception e) {
            System.err.println("❌ Error al crear admin por defecto: " + e.getMessage());
        }
    }

    /**
     * Inicializa usuarios de muestra para testing.
     */
    @Transactional
    private void initializeSampleUsers() {
        try {
            System.out.println("👥 Iniciando creación de usuarios de muestra...");
            
            // Crear usuarios básicos
            createUserIfNotExists("maria.garcia@instructor.com", "María", "García", "instructor123", User.Role.INSTRUCTOR);
            createUserIfNotExists("juan.perez@student.com", "Juan", "Pérez", "student123", User.Role.STUDENT);

            System.out.println("✅ Usuarios de muestra creados correctamente");

        } catch (Exception e) {
            System.err.println("❌ Error al crear usuarios de muestra: " + e.getMessage());
        }
    }

    /**
     * Crea un usuario si no existe.
     */
    private void createUserIfNotExists(String email, String firstName, String lastName, String password, User.Role role) {
        try {
            if (userRepository.findByEmail(email).isPresent()) {
                System.out.println("ℹ️  Usuario " + email + " ya existe");
                return;
            }

            User user = new User();
            user.setUserName(firstName);
            user.setLastName(lastName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setActive(true);

            userRepository.save(user);
            String roleName = role == User.Role.INSTRUCTOR ? "Instructor" : "Estudiante";
            System.out.println("✅ " + roleName + " creado: " + email + " (Contraseña: " + password + " encriptada)");
            
        } catch (Exception e) {
            System.err.println("❌ Error al crear usuario " + email + ": " + e.getMessage());
        }
    }
}
