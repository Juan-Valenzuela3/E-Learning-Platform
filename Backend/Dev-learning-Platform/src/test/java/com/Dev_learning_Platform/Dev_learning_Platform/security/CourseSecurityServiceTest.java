package com.Dev_learning_Platform.Dev_learning_Platform.security;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseSecurityServiceTest {

    @Mock
    private EnrollmentService enrollmentService;

    @Mock
    private CourseService courseService;

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private CourseSecurityService courseSecurityService;

    private User testUser;
    private Course testCourse;
    private Long courseId = 1L;
    private Long userId = 1L;

    @BeforeEach
    void setUp() {
        // Configurar usuario de prueba
        testUser = new User();
        testUser.setId(userId);
        testUser.setEmail("test@example.com");
        testUser.setRole(User.Role.STUDENT);

        // Configurar curso de prueba
        testCourse = new Course();
        testCourse.setId(courseId);
        testCourse.setInstructor(testUser);
    }

    @Test
    void testIsEnrolled_WhenUserIsEnrolled_ShouldReturnTrue() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(enrollmentService.isStudentEnrolled(userId, courseId)).thenReturn(true);

        // Act
        boolean result = courseSecurityService.isEnrolled(authentication, courseId);

        // Assert
        assertTrue(result);
        verify(enrollmentService).isStudentEnrolled(userId, courseId);
    }

    @Test
    void testIsEnrolled_WhenUserIsNotEnrolled_ShouldReturnFalse() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(enrollmentService.isStudentEnrolled(userId, courseId)).thenReturn(false);

        // Act
        boolean result = courseSecurityService.isEnrolled(authentication, courseId);

        // Assert
        assertFalse(result);
        verify(enrollmentService).isStudentEnrolled(userId, courseId);
    }

    @Test
    void testIsEnrolled_WhenAuthenticationIsNull_ShouldReturnFalse() {
        // Act
        boolean result = courseSecurityService.isEnrolled(null, courseId);

        // Assert
        assertFalse(result);
        verifyNoInteractions(enrollmentService);
    }

    @Test
    void testIsInstructorOfCourse_WhenUserIsInstructor_ShouldReturnTrue() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(courseService.findById(courseId)).thenReturn(testCourse);

        // Act
        boolean result = courseSecurityService.isInstructorOfCourse(authentication, courseId);

        // Assert
        assertTrue(result);
        verify(courseService).findById(courseId);
    }

    @Test
    void testIsInstructorOfCourse_WhenUserIsNotInstructor_ShouldReturnFalse() {
        // Arrange
        User otherUser = new User();
        otherUser.setId(2L);
        testCourse.setInstructor(otherUser);

        when(authentication.getPrincipal()).thenReturn(testUser);
        when(courseService.findById(courseId)).thenReturn(testCourse);

        // Act
        boolean result = courseSecurityService.isInstructorOfCourse(authentication, courseId);

        // Assert
        assertFalse(result);
        verify(courseService).findById(courseId);
    }

    @Test
    void testIsInstructorOfCourse_WhenCourseNotFound_ShouldReturnFalse() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(testUser);
        when(courseService.findById(courseId)).thenThrow(new IllegalArgumentException("Curso no encontrado"));

        // Act
        boolean result = courseSecurityService.isInstructorOfCourse(authentication, courseId);

        // Assert
        assertFalse(result);
        verify(courseService).findById(courseId);
    }

    @Test
    void testIsInstructorOfCourse_WhenAuthenticationIsNull_ShouldReturnFalse() {
        // Act
        boolean result = courseSecurityService.isInstructorOfCourse(null, courseId);

        // Assert
        assertFalse(result);
        verifyNoInteractions(courseService);
    }
}
