package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private CourseService courseService;

    // ---------- Helpers ----------
    private CourseCreateDto sampleDto(Long instructorId) {
        CourseCreateDto dto = new CourseCreateDto();
        dto.setTitle("Curso de Spring");
        dto.setDescription("Descripción larga…");
        dto.setShortDescription("Descripción corta");
        dto.setInstructorId(instructorId);
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
        return u;
    }

    // ---------- Tests ----------

    @Test
    void createCourse_mapsDto_and_saves_withInstructor() {
        // arrange
        Long instructorId = 10L;
        CourseCreateDto dto = sampleDto(instructorId);
        User instructor = makeUser(instructorId, User.Role.INSTRUCTOR);

        when(userService.findById(instructorId)).thenReturn(instructor);
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
        assertEquals("Descripción larga…", saved.getDescription());
        assertEquals("Descripción corta", saved.getShortDescription());
        assertEquals(instructor, saved.getInstructor());
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
        when(courseRepository.findByInstructor(instructor)).thenReturn(List.of(c));

        List<Course> list = courseService.getCoursesByInstructor(instructorId);

        assertEquals(1, list.size());
        assertEquals(7L, list.get(0).getId());
        verify(courseRepository).findByInstructor(instructor);
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
