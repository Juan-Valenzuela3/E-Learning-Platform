package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseCreateDto courseDto) {
        Course createdCourse = courseService.createCourse(courseDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @GetMapping
    public ResponseEntity<List<Course>> getPublicCourses() {
        List<Course> courses = courseService.getPublicCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.findById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('INSTRUCTOR') and #instructorId == authentication.principal.id)")
    public ResponseEntity<List<Course>> getCoursesByInstructor(@PathVariable Long instructorId) {
        List<Course> courses = courseService.getCoursesByInstructor(instructorId);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/admin/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getAllActiveCourses() {
        List<Course> courses = courseService.getAllActiveCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Long categoryId) {
        try {
            List<Course> courses = courseService.getCoursesByCategory(categoryId);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/subcategory/{subcategoryId}")
    public ResponseEntity<List<Course>> getCoursesBySubcategory(@PathVariable Long subcategoryId) {
        try {
            List<Course> courses = courseService.getCoursesBySubcategory(subcategoryId);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/category/{categoryId}/subcategory/{subcategoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategoryAndSubcategory(
            @PathVariable Long categoryId, 
            @PathVariable Long subcategoryId) {
        try {
            List<Course> courses = courseService.getCoursesByCategoryAndSubcategory(categoryId, subcategoryId);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody CourseCreateDto courseDto) {
        Course updatedCourse = courseService.updateCourse(courseId, courseDto);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId) {
        courseService.deleteCourse(courseId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{courseId}/publish")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> togglePublishStatus(@PathVariable Long courseId) {
        Course updatedCourse = courseService.togglePublishStatus(courseId);
        return ResponseEntity.ok(updatedCourse);
    }
}
