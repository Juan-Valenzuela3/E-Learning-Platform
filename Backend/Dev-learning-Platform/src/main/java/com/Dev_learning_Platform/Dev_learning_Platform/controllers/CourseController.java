package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

/**
 * Controlador básico para operaciones relacionadas con cursos.
 * 
 * Funcionalidades básicas:
 * - Crear cursos (solo instructores y admins)
 * - Ver cursos del instructor
 * - Ver todos los cursos activos
 */
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    /**
     * Crear un nuevo curso (solo instructores y admins)
     */
    @PostMapping
    public ResponseEntity<?> createCourse(@RequestBody CourseCreateDto courseDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User instructor = userService.findByEmail(email);

            Course createdCourse = courseService.createCourse(courseDto, instructor.getId());
            return ResponseEntity.ok(createdCourse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al crear curso: " + e.getMessage());
        }
    }

    /**
     * Ver cursos del instructor autenticado
     */
    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyCourses() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User instructor = userService.findByEmail(email);

            List<Course> courses = courseService.getCoursesByInstructor(instructor.getId());
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener cursos: " + e.getMessage());
        }
    }

    /**
     * Ver todos los cursos activos (cualquier usuario autenticado)
     */
    @GetMapping("/all")
    public ResponseEntity<?> getAllActiveCourses() {
        try {
            List<Course> courses = courseService.getAllActiveCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al obtener cursos: " + e.getMessage());
        }
    }
}
