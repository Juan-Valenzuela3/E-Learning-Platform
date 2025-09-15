package com.Dev_learning_Platform.Dev_learning_Platform;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Subcategory;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CategoryService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.SubcategoryService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

/**
 * Test unitario para CourseService usando solo Mockito.
 */
@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserService userService;

    @Mock
    private CategoryService categoryService;

    @Mock
    private SubcategoryService subcategoryService;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @InjectMocks
    private CourseService courseService;

    // ---------- Helpers ----------
    
    private CourseCreateDto sampleDto(Long instructorId) {
        CourseCreateDto dto = new CourseCreateDto();
        dto.setTitle("Curso de Spring");
        dto.setDescription("Descripción larga del curso de Spring Boot");
        dto.setShortDescription("Descripción corta");
        dto.setInstructorId(instructorId);
        dto.setCategoryId(1L); // Categoría "Programación"
        dto.setSubcategoryId(1L); // Subcategoría "Java"
        dto.setYoutubeUrls(List.of("https://www.youtube.com/watch?v=abc12345_-Z"));
        dto.setThumbnailUrl("https://cdn.example.com/thumb.png");
        dto.setPrice(new BigDecimal("49.99"));
        dto.setIsPremium(false);
        dto.setIsPublished(true);
        dto.setIsActive(true);
        dto.setEstimatedHours(12);
        return dto;
    }

    private User makeUser(Long id, User.Role role) {
        User u = new User();
        u.setId(id);
        u.setRole(role);
        u.setEmail("instructor@example.com");
        u.setUserName("Name");
        u.setLastName("Last");
        u.setPassword("x"); // no se usa en test
        u.setActive(true);
        return u;
    }

    private Category makeCategory(Long id, String name) {
        Category category = new Category();
        category.setId(id);
        category.setName(name);
        category.setDescription("Descripción de " + name);
        category.setIsActive(true);
        return category;
    }

    private Subcategory makeSubcategory(Long id, String name, Category category) {
        Subcategory subcategory = new Subcategory();
        subcategory.setId(id);
        subcategory.setName(name);
        subcategory.setDescription("Descripción de " + name);
        subcategory.setCategory(category);
        subcategory.setIsActive(true);
        return subcategory;
    }

    // ---------- Tests ----------

    @Test
    void createCourse_mapsDto_and_saves_withInstructor() {
        // arrange
        Long instructorId = 10L;
        Long categoryId = 1L;
        Long subcategoryId = 1L;
        
        CourseCreateDto dto = sampleDto(instructorId);
        User instructor = makeUser(instructorId, User.Role.INSTRUCTOR);
        Category category = makeCategory(categoryId, "Programación");
        Subcategory subcategory = makeSubcategory(subcategoryId, "Java", category);

        // Configurar mocks
        when(userService.findById(instructorId)).thenReturn(instructor);
        when(categoryService.getCategoryById(categoryId)).thenReturn(Optional.of(category));
        when(subcategoryService.getSubcategoryById(subcategoryId)).thenReturn(Optional.of(subcategory));
        
        // simulamos que el repo asigna ID al guardar
        when(courseRepository.save(any(Course.class))).thenAnswer(inv -> {
            Course c = inv.getArgument(0);
            c.setId(100L);
            return c;
        });

        // act
        Course saved = courseService.createCourse(dto);

        // assert
        assertNotNull(saved.getId());
        assertEquals(100L, saved.getId());
        assertEquals("Curso de Spring", saved.getTitle());
        assertEquals("Descripción larga del curso de Spring Boot", saved.getDescription());
        assertEquals("Descripción corta", saved.getShortDescription());
        assertEquals(instructor, saved.getInstructor());
        assertEquals(category, saved.getCategory());
        assertEquals(subcategory, saved.getSubcategory());
        assertEquals(new BigDecimal("49.99"), saved.getPrice());
        assertEquals(Boolean.TRUE, saved.getIsPublished());
        assertEquals(Boolean.TRUE, saved.getIsActive());
        assertEquals(12, saved.getEstimatedHours());

        // verificamos que realmente se haya mapeado lo enviado
        ArgumentCaptor<Course> captor = ArgumentCaptor.forClass(Course.class);
        verify(courseRepository).save(captor.capture());
        Course toSave = captor.getValue();
        assertEquals(dto.getTitle(), toSave.getTitle());
        assertEquals(dto.getThumbnailUrl(), toSave.getThumbnailUrl());
        assertEquals(dto.getYoutubeUrls(), toSave.getYoutubeUrls());
        
        // Verificar que se llamaron los servicios necesarios
        verify(userService).findById(instructorId);
        verify(categoryService).getCategoryById(categoryId);
        verify(subcategoryService).getSubcategoryById(subcategoryId);
    }

    @Test
    void createCourse_categoryNotFound_throwsException() {
        // arrange
        Long instructorId = 10L;
        Long categoryId = 999L; // Categoría que no existe
        
        CourseCreateDto dto = sampleDto(instructorId);
        dto.setCategoryId(categoryId); // Importante: cambiar el categoryId en el DTO
        
        User instructor = makeUser(instructorId, User.Role.INSTRUCTOR);

        when(userService.findById(instructorId)).thenReturn(instructor);
        when(categoryService.getCategoryById(categoryId)).thenReturn(Optional.empty());

        // act & assert
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> courseService.createCourse(dto)
        );
        
        assertTrue(ex.getMessage().contains("Categoría no encontrada"));
        verify(userService).findById(instructorId);
        verify(categoryService).getCategoryById(categoryId);
    }

    @Test
    void createCourse_subcategoryNotBelongToCategory_throwsException() {
        // arrange
        Long instructorId = 10L;
        Long categoryId = 1L;
        Long subcategoryId = 2L;
        
        CourseCreateDto dto = sampleDto(instructorId);
        dto.setCategoryId(categoryId);
        dto.setSubcategoryId(subcategoryId);
        
        User instructor = makeUser(instructorId, User.Role.INSTRUCTOR);
        Category category = makeCategory(categoryId, "Programación");
        Category differentCategory = makeCategory(999L, "Diseño"); // Categoría diferente
        Subcategory subcategory = makeSubcategory(subcategoryId, "Photoshop", differentCategory);

        when(userService.findById(instructorId)).thenReturn(instructor);
        when(categoryService.getCategoryById(categoryId)).thenReturn(Optional.of(category));
        when(subcategoryService.getSubcategoryById(subcategoryId)).thenReturn(Optional.of(subcategory));

        // act & assert
        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> courseService.createCourse(dto)
        );
        
        assertTrue(ex.getMessage().contains("La subcategoría no pertenece a la categoría"));
        verify(userService).findById(instructorId);
        verify(categoryService).getCategoryById(categoryId);
        verify(subcategoryService).getSubcategoryById(subcategoryId);
    }

    @Test
    void getPublicCourses_returns_list_from_repo() {
        Course a = new Course(); a.setId(1L); a.setTitle("A");
        Course b = new Course(); b.setId(2L); b.setTitle("B");
        when(courseRepository.findByIsActiveAndIsPublished(true, true)).thenReturn(List.of(a, b));

        List<Course> result = courseService.getPublicCourses();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(courseRepository).findByIsActiveAndIsPublished(true, true);
    }

    @Test
    void findById_found_returns_entity() {
        Course c = new Course(); c.setId(5L); c.setTitle("X");
        when(courseRepository.findById(5L)).thenReturn(Optional.of(c));

        Course result = courseService.findById(5L);

        assertEquals(5L, result.getId());
        assertEquals("X", result.getTitle());
        verify(courseRepository).findById(5L);
    }

    @Test
    void findById_notFound_throws_IllegalArgumentException() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> courseService.findById(99L)
        );
        assertTrue(ex.getMessage().contains("Curso no encontrado"));
        verify(courseRepository).findById(99L);
    }

    @Test
    void getCoursesByInstructor_queries_repo_with_user() {
        Long instructorId = 22L;
        User instructor = makeUser(instructorId, User.Role.INSTRUCTOR);
        Course c = new Course(); c.setId(7L); c.setInstructor(instructor);

        when(userService.findById(instructorId)).thenReturn(instructor);
        when(courseRepository.findByInstructorAndIsActive(instructor, true)).thenReturn(List.of(c));

        List<Course> list = courseService.getCoursesByInstructor(instructorId);

        assertEquals(1, list.size());
        assertEquals(7L, list.get(0).getId());
        verify(courseRepository).findByInstructorAndIsActive(instructor, true);
    }

    @Test
    void getAllActiveCourses_returns_active_from_repo() {
        Course c = new Course(); c.setId(3L); c.setIsActive(true);
        when(courseRepository.findByIsActive(true)).thenReturn(List.of(c));

        List<Course> list = courseService.getAllActiveCourses();

        assertEquals(1, list.size());
        assertTrue(list.get(0).getIsActive());
        verify(courseRepository).findByIsActive(true);
    }

    @Test
    void canCreateCourses_true_for_instructor_or_admin_false_for_student() {
        User instructor = makeUser(1L, User.Role.INSTRUCTOR);
        User admin = makeUser(2L, User.Role.ADMIN);
        User student = makeUser(3L, User.Role.STUDENT);

        when(userService.findById(1L)).thenReturn(instructor);
        when(userService.findById(2L)).thenReturn(admin);
        when(userService.findById(3L)).thenReturn(student);

        assertTrue(courseService.canCreateCourses(1L));
        assertTrue(courseService.canCreateCourses(2L));
        assertFalse(courseService.canCreateCourses(3L));
    }
}