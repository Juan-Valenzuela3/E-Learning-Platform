package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;

import lombok.RequiredArgsConstructor;


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
        
        // Validar que la categoría y subcategoría existan
        Category category = categoryService.getCategoryById(courseDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + courseDto.getCategoryId()));
        
        Subcategory subcategory = subcategoryService.getSubcategoryById(courseDto.getSubcategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + courseDto.getSubcategoryId()));
        
        // Validar que la subcategoría pertenezca a la categoría
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException("La subcategoría no pertenece a la categoría especificada");
        }
        
        Course course = mapDtoToEntity(courseDto, instructor, category, subcategory);
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

    /**
     * Obtiene cursos por categoría
     */
    public List<Course> getCoursesByCategory(Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + categoryId));
        return courseRepository.findByCategoryAndIsActiveAndIsPublished(category, true, true);
    }

    /**
     * Obtiene cursos por subcategoría
     */
    public List<Course> getCoursesBySubcategory(Long subcategoryId) {
        Subcategory subcategory = subcategoryService.getSubcategoryById(subcategoryId)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + subcategoryId));
        return courseRepository.findBySubcategoryAndIsActiveAndIsPublished(subcategory, true, true);
    }

    /**
     * Obtiene cursos por categoría y subcategoría
     */
    public List<Course> getCoursesByCategoryAndSubcategory(Long categoryId, Long subcategoryId) {
        Category category = categoryService.getCategoryById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + categoryId));
        
        Subcategory subcategory = subcategoryService.getSubcategoryById(subcategoryId)
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + subcategoryId));
        
        // Validar que la subcategoría pertenezca a la categoría
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException("La subcategoría no pertenece a la categoría especificada");
        }
        
        return courseRepository.findByCategoryAndSubcategoryAndIsActiveAndIsPublished(category, subcategory, true, true);
    }

    public boolean canCreateCourses(Long userId) {
        User user = userService.findById(userId);
        return user.getRole() == User.Role.INSTRUCTOR || user.getRole() == User.Role.ADMIN;
    }


    private Course mapDtoToEntity(CourseCreateDto dto, User instructor, Category category, Subcategory subcategory) {
        Course course = new Course();
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setShortDescription(dto.getShortDescription());
        course.setInstructor(instructor);
        course.setCategory(category);
        course.setSubcategory(subcategory);
        course.setYoutubeUrls(dto.getYoutubeUrls());
        course.setThumbnailUrl(dto.getThumbnailUrl());
        course.setPrice(dto.getPrice());
        course.setIsPremium(dto.getIsPremium());
        course.setIsPublished(dto.getIsPublished());
        course.setIsActive(dto.getIsActive());
        course.setEstimatedHours(dto.getEstimatedHours());
        
        return course;
    }

    public Course updateCourse(Long courseId, CourseCreateDto courseDto) {
        Course existingCourse = findById(courseId);

        User authenticatedUser = userService.getAuthenticatedUser();
        boolean isAdmin = authenticatedUser.getRole() == User.Role.ADMIN;
        boolean isOwner = existingCourse.getInstructor().getId().equals(authenticatedUser.getId());
        if (!isAdmin && !isOwner) {
            throw new AccessDeniedException("No tienes permisos para editar este curso.");
        }

        User instructor = userService.findById(courseDto.getInstructorId());
        Category category = categoryService.getCategoryById(courseDto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada con ID: " + courseDto.getCategoryId()));
        Subcategory subcategory = subcategoryService.getSubcategoryById(courseDto.getSubcategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Subcategoría no encontrada con ID: " + courseDto.getSubcategoryId()));
        if (!subcategory.getCategory().getId().equals(category.getId())) {
            throw new IllegalArgumentException("La subcategoría no pertenece a la categoría especificada");
        }

        // Actualizar los campos del curso existente
        existingCourse.setTitle(courseDto.getTitle());
        existingCourse.setDescription(courseDto.getDescription());
        existingCourse.setShortDescription(courseDto.getShortDescription());
        existingCourse.setInstructor(instructor);
        existingCourse.setCategory(category);
        existingCourse.setSubcategory(subcategory);
        existingCourse.setYoutubeUrls(courseDto.getYoutubeUrls());
        existingCourse.setThumbnailUrl(courseDto.getThumbnailUrl());
        existingCourse.setPrice(courseDto.getPrice());
        existingCourse.setIsPremium(courseDto.getIsPremium());
        existingCourse.setIsPublished(courseDto.getIsPublished());
        existingCourse.setIsActive(courseDto.getIsActive());
        existingCourse.setEstimatedHours(courseDto.getEstimatedHours());

        return courseRepository.save(existingCourse);
    }
}