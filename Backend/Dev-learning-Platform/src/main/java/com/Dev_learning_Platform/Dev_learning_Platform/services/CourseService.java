package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;

/**
 * Servicio básico para gestionar cursos.
 * 
 * Funcionalidades básicas:
 * - Crear cursos
 * - Obtener cursos por instructor
 * - Obtener todos los cursos activos
 */
@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserService userService;

    /**
     * Crear un nuevo curso
     */
    public Course createCourse(CourseCreateDto courseDto, Long instructorId) {
        User instructor = userService.findById(instructorId);
        
        // Verificar que el usuario es instructor o admin
        if (instructor.getRole() != User.Role.INSTRUCTOR && instructor.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Solo los instructores y administradores pueden crear cursos");
        }

        // Crear nuevo curso
        Course course = new Course();
        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        course.setInstructor(instructor);
        course.setActive(courseDto.isActive());

        return courseRepository.save(course);
    }

    /**
     * Obtener cursos de un instructor
     */
    public List<Course> getCoursesByInstructor(Long instructorId) {
        User instructor = userService.findById(instructorId);
        return courseRepository.findByInstructor(instructor);
    }

    /**
     * Obtener todos los cursos activos
     */
    public List<Course> getAllActiveCourses() {
        return courseRepository.findByIsActive(true);
    }
}
