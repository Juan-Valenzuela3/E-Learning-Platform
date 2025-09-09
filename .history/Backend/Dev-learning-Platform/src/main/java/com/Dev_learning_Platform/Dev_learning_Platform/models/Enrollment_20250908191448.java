package com.Dev_learning_Platform.Dev_learning_Platform.models;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

/**
 * Modelo para las inscripciones de estudiantes a cursos
 */
@Entity
@Table(name = "enrollments", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "course_id"}))
@Getter
@Setter
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EnrollmentStatus status = EnrollmentStatus.ACTIVE;

    @Column(name = "enrolled_at", nullable = false)
    private LocalDateTime enrolledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "progress_percentage", nullable = false)
    private Integer progressPercentage = 0;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Estados posibles de una inscripción
     */
    public enum EnrollmentStatus {
        ACTIVE,     // Inscrito activamente
        COMPLETED,  // Curso completado
        DROPPED,    // Abandonó el curso
        SUSPENDED   // Suspendido por admin
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
        if (enrolledAt == null) {
            enrolledAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    /**
     * Verifica si la inscripción está activa
     */
    public boolean isActive() {
        return status == EnrollmentStatus.ACTIVE;
    }

    /**
     * Verifica si el curso está completado
     */
    public boolean isCompleted() {
        return status == EnrollmentStatus.COMPLETED;
    }

    /**
     * Marca el curso como completado
     */
    public void markAsCompleted() {
        this.status = EnrollmentStatus.COMPLETED;
        this.completedAt = LocalDateTime.now();
        this.progressPercentage = 100;
    }

    /**
     * Actualiza el progreso del curso
     */
    public void updateProgress(Integer percentage) {
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;
        this.progressPercentage = percentage;
        
        // Si llega al 100%, marcar como completado
        if (percentage == 100 && !isCompleted()) {
            markAsCompleted();
        }
    }
}
