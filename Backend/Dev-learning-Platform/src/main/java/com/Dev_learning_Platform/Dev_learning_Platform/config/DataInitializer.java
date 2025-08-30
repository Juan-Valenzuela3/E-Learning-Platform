package com.Dev_learning_Platform.Dev_learning_Platform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

/**
 * Inicializador de datos por defecto para la aplicación.
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
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.Dev_learning_Platform.Dev_learning_Platform.services.UserService userService;

    @Override
    public void run(String... args) throws Exception {
        initializeDefaultAdmin();
        System.out.println("✅ Datos inicializados correctamente");
    }

    /**
     * Inicializa el usuario administrador por defecto.
     * 
     * Crea un usuario admin con las siguientes características:
     * - Email: admin@system.com
     * - Contraseña: admin123 (encriptada con BCrypt)
     * - Rol: ADMIN
     * - Estado: Activo
     * 
     * Solo se crea si no existe ya un usuario con ese email.
     */
    private void initializeDefaultAdmin() {
        try {
            // Verificar si ya existe el admin
            if (userRepository.findByEmail("admin@system.com").isPresent()) {
                System.out.println("ℹ️  Admin por defecto ya existe");
                return;
            }

            // Crear usuario admin
            User admin = new User();
            admin.setUserName("Administrador");
            admin.setLastName("Sistema");
            admin.setEmail("admin@system.com");
            admin.setPassword("admin123"); // Se encriptará automáticamente en saveUser()
            admin.setRole(User.Role.ADMIN);
            admin.setActive(true);

            // Guardar admin
            userService.saveUser(admin);
            System.out.println("✅ Admin por defecto creado:");
            System.out.println("   📧 Email: admin@system.com");
            System.out.println("   🔑 Contraseña: admin123");
            System.out.println("   👤 Rol: ADMIN");

        } catch (Exception e) {
            System.err.println("❌ Error al crear admin por defecto: " + e.getMessage());
        }
    }
}
