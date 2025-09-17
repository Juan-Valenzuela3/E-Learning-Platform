
package com.Dev_learning_Platform.Dev_learning_Platform.services;

/*
 * ARCHIVO COMENTADO - TestDataService solo para desarrollo/testing
 * 
 * Para habilitar en desarrollo, descomenta todo el contenido de este archivo.
 * Este servicio crea datos de prueba automáticamente al iniciar la aplicación.
 * 
 * NO debe ejecutarse en producción.
 */

/*
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.SubcategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servicio para crear datos de prueba para las estadísticas administrativas
 * COMENTADO - Solo para desarrollo/testing - NO se ejecuta en producción
 * 
 * Para habilitar en desarrollo, descomenta las anotaciones @Service y @Profile
 */
// @Service
// @Profile({"dev", "test"}) // Solo se ejecuta en perfiles de desarrollo y test
// @RequiredArgsConstructor
// @Slf4j
// CLASE COMENTADA - Solo para desarrollo/testing
/*
public class TestDataService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final SubcategoryRepository subcategoryRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Solo crear datos si no existen
        if (userRepository.count() > 1) {
            log.info("Los datos de prueba ya existen, saltando creación");
            return;
        }

        log.info("Creando datos de prueba para estadísticas...");
        createTestData();
        log.info("Datos de prueba creados exitosamente");
    }

    private void createTestData() {
        // Crear categorías
        Category programacion = createCategory("Programación", "Cursos de programación y desarrollo", 1, true);
        Category diseno = createCategory("Diseño", "Cursos de diseño gráfico y web", 2, true);
        Category marketing = createCategory("Marketing", "Cursos de marketing digital", 3, true);
        Category negocios = createCategory("Negocios", "Cursos de emprendimiento y negocios", 4, true);

        // Crear subcategorías
        Subcategory java = createSubcategory("Java", "Desarrollo con Java", programacion, 1, true);
        Subcategory spring = createSubcategory("Spring", "Framework Spring", programacion, 2, true);
        Subcategory react = createSubcategory("React", "Biblioteca React", programacion, 3, true);
        Subcategory python = createSubcategory("Python", "Lenguaje Python", programacion, 4, true);
        
        Subcategory ui = createSubcategory("UI/UX", "Diseño de interfaces", diseno, 1, true);
        Subcategory photoshop = createSubcategory("Photoshop", "Edición con Photoshop", diseno, 2, true);
        
        Subcategory social = createSubcategory("Redes Sociales", "Marketing en redes sociales", marketing, 1, true);
        Subcategory ads = createSubcategory("Publicidad", "Publicidad digital", marketing, 2, true);
        
        Subcategory emprendimiento = createSubcategory("Emprendimiento", "Crear tu negocio", negocios, 1, true);
        Subcategory gestion = createSubcategory("Gestión", "Gestión de proyectos", negocios, 2, true);

        // Crear usuarios
        User admin = createUser("admin", "admin", "admin@test.com", "Password123", User.Role.ADMIN, true);
        User instructor1 = createUser("Juan", "Pérez", "juan@example.com", "Password123", User.Role.INSTRUCTOR, true);
        User instructor2 = createUser("María", "García", "maria@example.com", "Password123", User.Role.INSTRUCTOR, true);
        User instructor3 = createUser("Carlos", "López", "carlos@example.com", "Password123", User.Role.INSTRUCTOR, true);

        // Crear estudiantes
        List<User> estudiantes = Arrays.asList(
            createUser("Ana", "Martínez", "ana@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Luis", "Rodríguez", "luis@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Sofia", "Hernández", "sofia@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Diego", "González", "diego@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Elena", "Morales", "elena@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Roberto", "Jiménez", "roberto@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Carmen", "Ruiz", "carmen@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Fernando", "Díaz", "fernando@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Isabel", "Moreno", "isabel@student.com", "Password123", User.Role.STUDENT, true),
            createUser("Antonio", "Vega", "antonio@student.com", "Password123", User.Role.STUDENT, true)
        );

        // Crear cursos
        List<Course> cursos = Arrays.asList(
            createCourse("Java desde Cero", "Aprende Java desde los fundamentos", instructor1, programacion, java, 
                        BigDecimal.valueOf(99.99), true, true, true),
            createCourse("Spring Boot Avanzado", "Desarrollo de aplicaciones con Spring Boot", instructor1, programacion, spring, 
                        BigDecimal.valueOf(149.99), true, true, true),
            createCourse("React para Principiantes", "Introducción a React y JavaScript", instructor2, programacion, react, 
                        BigDecimal.valueOf(79.99), true, true, false),
            createCourse("Diseño UI/UX", "Principios de diseño de interfaces", instructor2, diseno, ui, 
                        BigDecimal.valueOf(129.99), true, true, true),
            createCourse("Photoshop Avanzado", "Técnicas avanzadas de Photoshop", instructor3, diseno, photoshop, 
                        BigDecimal.valueOf(89.99), true, true, false),
            createCourse("Marketing Digital", "Estrategias de marketing en redes sociales", instructor1, marketing, social, 
                        BigDecimal.valueOf(199.99), true, true, true),
            createCourse("Google Ads", "Publicidad efectiva en Google", instructor2, marketing, ads, 
                        BigDecimal.valueOf(159.99), true, true, false),
            createCourse("Emprendimiento", "Cómo iniciar tu propio negocio", instructor3, negocios, emprendimiento, 
                        BigDecimal.valueOf(249.99), true, true, true),
            createCourse("Gestión de Proyectos", "Metodologías ágiles y gestión", instructor1, negocios, gestion, 
                        BigDecimal.valueOf(179.99), true, true, false),
            createCourse("Python para Data Science", "Análisis de datos con Python", instructor3, programacion, python, 
                        BigDecimal.valueOf(219.99), true, true, true)
        );

        // Crear inscripciones
        createEnrollments(estudiantes, cursos);

        log.info("Datos de prueba creados:");
        log.info("- {} usuarios total", userRepository.count());
        log.info("- {} categorías", categoryRepository.count());
        log.info("- {} cursos", courseRepository.count());
        log.info("- {} inscripciones", enrollmentRepository.count());
    }

    private Category createCategory(String name, String description, int sortOrder, boolean isActive) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setSortOrder(sortOrder);
        category.setIsActive(isActive);
        // createdAt y updatedAt se establecen automáticamente con @PrePersist
        return categoryRepository.save(category);
    }

    private User createUser(String userName, String lastName, String email, String password, User.Role role, boolean isActive) {
        User user = new User();
        user.setUserName(userName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Hashear la contraseña
        user.setRole(role);
        user.setActive(isActive);
        // createdAt y updatedAt se establecen automáticamente con @PrePersist
        return userRepository.save(user);
    }

    private Subcategory createSubcategory(String name, String description, Category category, int sortOrder, boolean isActive) {
        Subcategory subcategory = new Subcategory();
        subcategory.setName(name);
        subcategory.setDescription(description);
        subcategory.setCategory(category);
        subcategory.setSortOrder(sortOrder);
        subcategory.setIsActive(isActive);
        // createdAt y updatedAt se establecen automáticamente con @PrePersist
        return subcategoryRepository.save(subcategory);
    }

    private Course createCourse(String title, String description, User instructor, Category category, Subcategory subcategory,
                               BigDecimal price, boolean isActive, boolean isPublished, boolean isPremium) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setPrice(price);
        course.setIsActive(isActive);
        course.setIsPublished(isPublished);
        course.setIsPremium(isPremium);
        // createdAt y updatedAt se establecen automáticamente con @PrePersist
        return courseRepository.save(course);
    }

    private void createEnrollments(List<User> estudiantes, List<Course> cursos) {
        // Crear inscripciones variadas
        for (int i = 0; i < estudiantes.size(); i++) {
            User estudiante = estudiantes.get(i);
            
            // Cada estudiante se inscribe en 3-5 cursos aleatorios
            int numCursos = 3 + (i % 3); // 3, 4, o 5 cursos
            for (int j = 0; j < numCursos && j < cursos.size(); j++) {
                Course curso = cursos.get((i + j) % cursos.size());
                
                Enrollment enrollment = new Enrollment();
                enrollment.setStudent(estudiante);
                enrollment.setCourse(curso);
                enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);
                enrollment.setProgressPercentage(10 + (j * 20)); // Progreso variado
                enrollment.setEnrolledAt(LocalDateTime.now().minusDays(30 + j * 5));
                
                // Algunos cursos completados
                if (j == 0) {
                    enrollment.setStatus(Enrollment.EnrollmentStatus.COMPLETED);
                    enrollment.setProgressPercentage(100);
                    enrollment.setCompletedAt(LocalDateTime.now().minusDays(5));
                }
                
                enrollmentRepository.save(enrollment);
            }
        }
    }
}
*/
