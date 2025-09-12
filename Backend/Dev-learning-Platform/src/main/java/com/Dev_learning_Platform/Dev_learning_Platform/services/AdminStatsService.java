package com.Dev_learning_Platform.Dev_learning_Platform.services;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.admin.*;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Category;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CategoryRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para generar estadísticas de administración
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatsService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CategoryRepository categoryRepository;

    /**
     * Obtiene todas las estadísticas de la plataforma
     */
    public AdminStatsDto getAllStats() {
        log.info("Generando estadísticas completas de la plataforma");
        
        return AdminStatsDto.builder()
                .userStats(getUserStats())
                .courseStats(getCourseStats())
                .enrollmentStats(getEnrollmentStats())
                .revenueStats(getRevenueStats())
                .categoryDistribution(getCategoryDistribution())
                .growthStats(getGrowthStats())
                .build();
    }

    /**
     * Obtiene estadísticas de usuarios
     */
    public UserStatsDto getUserStats() {
        Timestamp thirtyDaysAgo = Timestamp.valueOf(LocalDateTime.now().minus(30, ChronoUnit.DAYS));
        Timestamp sevenDaysAgo = Timestamp.valueOf(LocalDateTime.now().minus(7, ChronoUnit.DAYS));

        Long totalUsers = userRepository.count();
        Long totalStudents = userRepository.countByRole(User.Role.STUDENT);
        Long totalInstructors = userRepository.countByRole(User.Role.INSTRUCTOR);
        Long totalAdmins = userRepository.countByRole(User.Role.ADMIN);
        Long activeUsers = userRepository.countByIsActive(true);
        Long inactiveUsers = userRepository.countByIsActive(false);
        Long newUsersLast30Days = userRepository.countByCreatedAtAfter(thirtyDaysAgo);
        Long newUsersLast7Days = userRepository.countByCreatedAtAfter(sevenDaysAgo);

        return new UserStatsDto(
                totalUsers, totalStudents, totalInstructors, totalAdmins,
                activeUsers, inactiveUsers, newUsersLast30Days, newUsersLast7Days
        );
    }

    /**
     * Obtiene estadísticas de cursos
     */
    public CourseStatsDto getCourseStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);
        LocalDateTime sevenDaysAgo = now.minus(7, ChronoUnit.DAYS);

        Long totalCourses = courseRepository.count();
        Long publishedCourses = courseRepository.countByIsPublished(true);
        Long draftCourses = courseRepository.countByIsPublished(false);
        Long premiumCourses = courseRepository.countByIsPremium(true);
        Long freeCourses = courseRepository.countByIsPremium(false);
        Long activeCourses = courseRepository.countByIsActive(true);
        Long inactiveCourses = courseRepository.countByIsActive(false);
        Long newCoursesLast30Days = courseRepository.countByCreatedAtAfter(thirtyDaysAgo);
        Long newCoursesLast7Days = courseRepository.countByCreatedAtAfter(sevenDaysAgo);

        // Calcular precio promedio
        List<Course> allCourses = courseRepository.findAll();
        Double averageCoursePrice = allCourses.stream()
                .mapToDouble(course -> course.getPrice().doubleValue())
                .average()
                .orElse(0.0);

        // Calcular horas totales estimadas
        Integer totalEstimatedHours = allCourses.stream()
                .filter(course -> course.getEstimatedHours() != null)
                .mapToInt(Course::getEstimatedHours)
                .sum();

        return new CourseStatsDto(
                totalCourses, publishedCourses, draftCourses, premiumCourses, freeCourses,
                activeCourses, inactiveCourses, newCoursesLast30Days, newCoursesLast7Days,
                averageCoursePrice, totalEstimatedHours
        );
    }

    /**
     * Obtiene estadísticas de inscripciones
     */
    public EnrollmentStatsDto getEnrollmentStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);
        LocalDateTime sevenDaysAgo = now.minus(7, ChronoUnit.DAYS);

        Long totalEnrollments = enrollmentRepository.count();
        Long activeEnrollments = enrollmentRepository.countByStatus(Enrollment.EnrollmentStatus.ACTIVE);
        Long completedEnrollments = enrollmentRepository.countByStatus(Enrollment.EnrollmentStatus.COMPLETED);
        Long droppedEnrollments = enrollmentRepository.countByStatus(Enrollment.EnrollmentStatus.DROPPED);
        Long suspendedEnrollments = enrollmentRepository.countByStatus(Enrollment.EnrollmentStatus.SUSPENDED);
        Long newEnrollmentsLast30Days = enrollmentRepository.countByCreatedAtAfter(thirtyDaysAgo);
        Long newEnrollmentsLast7Days = enrollmentRepository.countByCreatedAtAfter(sevenDaysAgo);

        // Calcular progreso promedio
        List<Enrollment> allEnrollments = enrollmentRepository.findAll();
        Double averageProgressPercentage = allEnrollments.stream()
                .mapToInt(Enrollment::getProgressPercentage)
                .average()
                .orElse(0.0);

        Long enrollmentsWithProgress = allEnrollments.stream()
                .filter(enrollment -> enrollment.getProgressPercentage() > 0)
                .count();

        return new EnrollmentStatsDto(
                totalEnrollments, activeEnrollments, completedEnrollments, droppedEnrollments, suspendedEnrollments,
                newEnrollmentsLast30Days, newEnrollmentsLast7Days, averageProgressPercentage, enrollmentsWithProgress
        );
    }

    /**
     * Obtiene estadísticas de ingresos
     */
    public RevenueStatsDto getRevenueStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);
        LocalDateTime sevenDaysAgo = now.minus(7, ChronoUnit.DAYS);

        // Calcular ingresos totales (solo de cursos premium)
        List<Course> premiumCourses = courseRepository.findByIsPremium(true);
        BigDecimal totalRevenue = premiumCourses.stream()
                .map(Course::getPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Calcular ingresos de los últimos 30 y 7 días
        List<Enrollment> enrollmentsLast30Days = enrollmentRepository.findByCreatedAtAfter(thirtyDaysAgo);
        List<Enrollment> enrollmentsLast7Days = enrollmentRepository.findByCreatedAtAfter(sevenDaysAgo);

        BigDecimal revenueLast30Days = calculateRevenueFromEnrollments(enrollmentsLast30Days);
        BigDecimal revenueLast7Days = calculateRevenueFromEnrollments(enrollmentsLast7Days);

        // Calcular promedios
        Long totalPaidEnrollments = enrollmentRepository.countByCourseIsPremium(true);
        Long paidEnrollmentsLast30Days = enrollmentsLast30Days.stream()
                .filter(enrollment -> enrollment.getCourse().getIsPremium())
                .count();
        Long paidEnrollmentsLast7Days = enrollmentsLast7Days.stream()
                .filter(enrollment -> enrollment.getCourse().getIsPremium())
                .count();

        BigDecimal averageRevenuePerCourse = totalPaidEnrollments > 0 
                ? totalRevenue.divide(BigDecimal.valueOf(totalPaidEnrollments), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Long totalStudents = userRepository.countByRole(User.Role.STUDENT);
        BigDecimal averageRevenuePerStudent = totalStudents > 0 
                ? totalRevenue.divide(BigDecimal.valueOf(totalStudents), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        return new RevenueStatsDto(
                totalRevenue, revenueLast30Days, revenueLast7Days, averageRevenuePerCourse,
                averageRevenuePerStudent, totalPaidEnrollments, paidEnrollmentsLast30Days, paidEnrollmentsLast7Days
        );
    }

    /**
     * Obtiene distribución por categorías
     */
    public List<CategoryStatsDto> getCategoryDistribution() {
        List<Category> categories = categoryRepository.findAll();
        
        return categories.stream()
                .map(this::getCategoryStats)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene estadísticas de crecimiento
     */
    public GrowthStatsDto getGrowthStats() {
        Timestamp thirtyDaysAgo = Timestamp.valueOf(LocalDateTime.now().minus(30, ChronoUnit.DAYS));
        Timestamp sixtyDaysAgo = Timestamp.valueOf(LocalDateTime.now().minus(60, ChronoUnit.DAYS));

        // Crecimiento de usuarios
        Long usersThisMonth = userRepository.countByCreatedAtAfter(thirtyDaysAgo);
        Long usersLastMonth = userRepository.countByCreatedAtBetween(sixtyDaysAgo, thirtyDaysAgo);
        Double userGrowthPercentage = calculateGrowthPercentage(usersThisMonth, usersLastMonth);

        // Crecimiento de cursos
        Long coursesThisMonth = courseRepository.countByCreatedAtAfter(thirtyDaysAgo.toLocalDateTime());
        Long coursesLastMonth = courseRepository.countByCreatedAtBetween(sixtyDaysAgo.toLocalDateTime(), thirtyDaysAgo.toLocalDateTime());
        Double courseGrowthPercentage = calculateGrowthPercentage(coursesThisMonth, coursesLastMonth);

        // Crecimiento de inscripciones
        Long enrollmentsThisMonth = enrollmentRepository.countByCreatedAtAfter(thirtyDaysAgo.toLocalDateTime());
        Long enrollmentsLastMonth = enrollmentRepository.countByCreatedAtBetween(sixtyDaysAgo.toLocalDateTime(), thirtyDaysAgo.toLocalDateTime());
        Double enrollmentGrowthPercentage = calculateGrowthPercentage(enrollmentsThisMonth, enrollmentsLastMonth);

        // Crecimiento de ingresos
        List<Enrollment> enrollmentsThisMonthList = enrollmentRepository.findByCreatedAtAfter(thirtyDaysAgo.toLocalDateTime());
        List<Enrollment> enrollmentsLastMonthList = enrollmentRepository.findByCreatedAtBetween(sixtyDaysAgo.toLocalDateTime(), thirtyDaysAgo.toLocalDateTime());
        
        BigDecimal revenueThisMonth = calculateRevenueFromEnrollments(enrollmentsThisMonthList);
        BigDecimal revenueLastMonth = calculateRevenueFromEnrollments(enrollmentsLastMonthList);
        Double revenueGrowthPercentage = calculateGrowthPercentage(revenueThisMonth, revenueLastMonth);

        // Usuarios activos diarios promedio (simplificado)
        Long totalActiveUsers = userRepository.countByIsActive(true);
        Double averageDailyActiveUsers = totalActiveUsers * 0.3; // Estimación del 30% de usuarios activos diariamente

        return new GrowthStatsDto(
                userGrowthPercentage, courseGrowthPercentage, enrollmentGrowthPercentage, revenueGrowthPercentage,
                usersThisMonth, coursesThisMonth, enrollmentsThisMonth, averageDailyActiveUsers
        );
    }

    /**
     * Calcula estadísticas para una categoría específica
     */
    private CategoryStatsDto getCategoryStats(Category category) {
        List<Course> categoryCourses = courseRepository.findByCategory(category);
        
        Long totalCourses = (long) categoryCourses.size();
        Long publishedCourses = categoryCourses.stream()
                .mapToLong(course -> course.getIsPublished() ? 1L : 0L)
                .sum();

        List<Enrollment> categoryEnrollments = enrollmentRepository.findByCourseIn(categoryCourses);
        Long totalEnrollments = (long) categoryEnrollments.size();
        Long activeEnrollments = categoryEnrollments.stream()
                .mapToLong(enrollment -> enrollment.getStatus() == Enrollment.EnrollmentStatus.ACTIVE ? 1L : 0L)
                .sum();

        Double averageProgress = categoryEnrollments.stream()
                .mapToInt(Enrollment::getProgressPercentage)
                .average()
                .orElse(0.0);

        Long totalStudents = categoryEnrollments.stream()
                .map(Enrollment::getStudent)
                .distinct()
                .count();

        return new CategoryStatsDto(
                category.getId(), category.getName(), category.getColor(), category.getIcon(),
                totalCourses, publishedCourses, totalEnrollments, activeEnrollments, averageProgress, totalStudents
        );
    }

    /**
     * Calcula ingresos a partir de una lista de inscripciones
     */
    private BigDecimal calculateRevenueFromEnrollments(List<Enrollment> enrollments) {
        return enrollments.stream()
                .filter(enrollment -> enrollment.getCourse().getIsPremium())
                .map(enrollment -> enrollment.getCourse().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Calcula el porcentaje de crecimiento
     */
    private Double calculateGrowthPercentage(Long current, Long previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return ((double) (current - previous) / previous) * 100;
    }

    /**
     * Calcula el porcentaje de crecimiento para BigDecimal
     */
    private Double calculateGrowthPercentage(BigDecimal current, BigDecimal previous) {
        if (previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }
}
