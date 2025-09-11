package com.Dev_learning_Platform.Dev_learning_Platform;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.EnrollmentService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private UserService userService;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private EnrollmentService enrollmentService;

    // Helper methods to create mock objects
    private User createStudent(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole(User.Role.STUDENT);
        return user;
    }

    private User createInstructor(Long id) {
        User user = new User();
        user.setId(id);
        user.setRole(User.Role.INSTRUCTOR);
        return user;
    }

    private Course createCourse(Long id, boolean isActive) {
        Course course = new Course();
        course.setId(id);
        course.setIsActive(isActive);
        return course;
    }

    @Test
    void enrollStudent_success() {
        // Arrange
        Long studentId = 1L;
        Long courseId = 10L;
        User student = createStudent(studentId);
        Course course = createCourse(courseId, true);

        when(userService.findById(studentId)).thenReturn(student);
        when(courseService.findById(courseId)).thenReturn(course);
        when(enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)).thenReturn(false);
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        Enrollment enrollment = enrollmentService.enrollStudent(studentId, courseId);

        // Assert
        assertNotNull(enrollment);
        assertEquals(student, enrollment.getStudent());
        assertEquals(course, enrollment.getCourse());
        assertEquals(Enrollment.EnrollmentStatus.ACTIVE, enrollment.getStatus());
        assertEquals(0, enrollment.getProgressPercentage());
        verify(enrollmentRepository).save(any(Enrollment.class));
    }

    @Test
    void enrollStudent_throwsException_whenUserIsNotStudent() {
        // Arrange
        Long instructorId = 2L;
        Long courseId = 10L;
        User instructor = createInstructor(instructorId);

        when(userService.findById(instructorId)).thenReturn(instructor);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            enrollmentService.enrollStudent(instructorId, courseId);
        });
        assertEquals("Solo los estudiantes pueden inscribirse a cursos", exception.getMessage());
    }

    @Test
    void enrollStudent_throwsException_whenStudentNotFound() {
        // Arrange
        Long nonExistentStudentId = 99L;
        Long courseId = 10L;
        String expectedMessage = "Usuario no encontrado con ID: " + nonExistentStudentId;

        when(userService.findById(nonExistentStudentId)).thenThrow(new IllegalArgumentException(expectedMessage));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            enrollmentService.enrollStudent(nonExistentStudentId, courseId);
        });
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void enrollStudent_throwsException_whenCourseNotFound() {
        // Arrange
        Long studentId = 1L;
        Long nonExistentCourseId = 99L;
        User student = createStudent(studentId);
        String expectedMessage = "Curso no encontrado con ID: " + nonExistentCourseId;

        when(userService.findById(studentId)).thenReturn(student);
        when(courseService.findById(nonExistentCourseId)).thenThrow(new IllegalArgumentException(expectedMessage));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            enrollmentService.enrollStudent(studentId, nonExistentCourseId);
        });
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void enrollStudent_throwsException_whenCourseNotActive() {
        // Arrange
        Long studentId = 1L;
        Long courseId = 10L;
        User student = createStudent(studentId);
        Course course = createCourse(courseId, false);

        when(userService.findById(studentId)).thenReturn(student);
        when(courseService.findById(courseId)).thenReturn(course);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            enrollmentService.enrollStudent(studentId, courseId);
        });
        assertEquals("El curso no está disponible para inscripciones", exception.getMessage());
    }

    @Test
    void enrollStudent_throwsException_whenAlreadyEnrolled() {
        // Arrange
        Long studentId = 1L;
        Long courseId = 10L;
        User student = createStudent(studentId);
        Course course = createCourse(courseId, true);

        when(userService.findById(studentId)).thenReturn(student);
        when(courseService.findById(courseId)).thenReturn(course);
        when(enrollmentRepository.existsByStudentIdAndCourseId(studentId, courseId)).thenReturn(true);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            enrollmentService.enrollStudent(studentId, courseId);
        });
        assertEquals("El estudiante ya está inscrito en este curso", exception.getMessage());
    }

    @Test
    void updateProgress_success() {
        // Arrange
        Long enrollmentId = 1L;
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setProgressPercentage(10);

        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.of(enrollment));
        when(enrollmentRepository.save(any(Enrollment.class))).thenReturn(enrollment);

        // Act
        Enrollment updatedEnrollment = enrollmentService.updateProgress(enrollmentId, 50);

        // Assert
        assertNotNull(updatedEnrollment);
        assertEquals(50, updatedEnrollment.getProgressPercentage());
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    void updateProgress_throwsException_whenEnrollmentNotFound() {
        // Arrange
        Long enrollmentId = 99L;
        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.empty());

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            enrollmentService.updateProgress(enrollmentId, 50);
        });
        assertTrue(exception.getMessage().contains("Inscripción no encontrada"));
    }

    @Test
    void unenrollStudent_setsStatusToDropped() {
        // Arrange
        Long enrollmentId = 1L;
        Enrollment enrollment = new Enrollment();
        enrollment.setId(enrollmentId);
        enrollment.setStatus(Enrollment.EnrollmentStatus.ACTIVE);

        when(enrollmentRepository.findById(enrollmentId)).thenReturn(Optional.of(enrollment));

        // Act
        enrollmentService.unenrollStudent(enrollmentId);

        // Assert
        assertEquals(Enrollment.EnrollmentStatus.DROPPED, enrollment.getStatus());
        verify(enrollmentRepository).save(enrollment);
    }

    @Test
    void isStudentEnrolled_returnsTrue_whenExists() {
        // Arrange
        when(enrollmentRepository.existsByStudentIdAndCourseId(1L, 10L)).thenReturn(true);

        // Act & Assert
        assertTrue(enrollmentService.isStudentEnrolled(1L, 10L));
    }
}
