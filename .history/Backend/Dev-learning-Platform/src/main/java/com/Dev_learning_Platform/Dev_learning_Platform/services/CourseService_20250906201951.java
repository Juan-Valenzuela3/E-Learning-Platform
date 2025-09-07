package com.Dev_learning_Platform.Dev_learning_Platform.services;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseService {

    private final CourseRepository courseRepository;
    private final UserService userService;
    private final CategoryService categoryService;
    private final SubcategoryService subcategoryService;

   
    @Transactional
    public Course createCourse(CourseCreateDto courseDto) {
        User instructor = userService.findById(courseDto.getInstructorId());
        
        Course course = mapDtoToEntity(courseDto, instructor);
        return courseRepository.save(course);
    }

    public List<Course> getPublicCourses() {
        return courseRepository.findByIsActiveAndIsPublished(true, true);
    }

    public Course findById(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado con ID: " + courseId));
    }

  
    public List<Course> getCoursesByInstructor(Long instructorId) {
        User instructor = userService.findById(instructorId);
        return courseRepository.findByInstructor(instructor);
    }

    public List<Course> getAllActiveCourses() {
        return courseRepository.findByIsActive(true);
    }

    public boolean canCreateCourses(Long userId) {
        User user = userService.findById(userId);
        return user.getRole() == User.Role.INSTRUCTOR || user.getRole() == User.Role.ADMIN;
    }


    private Course mapDtoToEntity(CourseCreateDto dto, User instructor) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setShortDescription(dto.getShortDescription());
        course.setInstructor(instructor);
        course.setYoutubeUrls(dto.getYoutubeUrls());
        course.setThumbnailUrl(dto.getThumbnailUrl());
        course.setPrice(dto.getPrice());
        course.setIsPremium(dto.getIsPremium());
        course.setIsPublished(dto.getIsPublished());
        course.setIsActive(dto.getIsActive());
        course.setEstimatedHours(dto.getEstimatedHours());
        
        return course;
    }
}