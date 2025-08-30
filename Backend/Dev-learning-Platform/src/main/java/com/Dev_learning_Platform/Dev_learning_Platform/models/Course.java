package com.Dev_learning_Platform.Dev_learning_Platform.models;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Modelo de entidad para representar cursos en la plataforma de e-learning.
 * 
 * Esta clase define la estructura de datos para los cursos del sistema,
 * incluyendo información del curso, instructor y metadatos.
 * 
 * Características principales:
 * - Información básica del curso (título, descripción)
 * - Relación con el instructor que creó el curso
 * - Control de estado activo/inactivo
 * - Timestamps automáticos de creación y actualización
 * 
 * Relaciones:
 * - Un curso pertenece a un instructor
 * - Un instructor puede tener múltiples cursos
 */
@Entity
@Table(name = "courses")
@Getter
@Setter
public class Course {
    
    /**
     * Identificador único auto-generado para el curso
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Título del curso. Campo obligatorio con longitud máxima de 100 caracteres.
     */
    @Column(name = "title", nullable = false, length = 100)
    private String title;

    /**
     * Descripción del curso. Campo obligatorio con longitud máxima de 500 caracteres.
     */
    @Column(name = "description", nullable = false, length = 500)
    private String description;

    /**
     * Instructor que creó el curso. Relación con la tabla users.
     */
    @ManyToOne
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    /**
     * Indica si el curso está activo en el sistema.
     * Por defecto es true. Los cursos inactivos no se muestran a los estudiantes.
     */
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    /**
     * Timestamp de cuando se creó el curso.
     * Se establece automáticamente antes de persistir.
     */
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    /**
     * Timestamp de la última actualización del curso.
     * Se actualiza automáticamente en cada modificación.
     */
    @Column(name = "updated_at", nullable = false)
    private Timestamp updatedAt;

    /**
     * Método que se ejecuta automáticamente antes de persistir la entidad.
     * Establece los timestamps de creación y actualización con la fecha/hora actual.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = new Timestamp(System.currentTimeMillis());
        updatedAt = new Timestamp(System.currentTimeMillis());
    }

    /**
     * Método que se ejecuta automáticamente antes de actualizar la entidad.
     * Actualiza el timestamp de modificación con la fecha/hora actual.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = new Timestamp(System.currentTimeMillis());
    }
}
