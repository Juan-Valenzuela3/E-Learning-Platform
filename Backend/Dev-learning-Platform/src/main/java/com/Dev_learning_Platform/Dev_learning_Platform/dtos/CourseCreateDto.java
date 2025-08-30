package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO para la creación de cursos.
 * 
 * Este DTO contiene los datos necesarios para crear un nuevo curso
 * en la plataforma de e-learning.
 * 
 * Características:
 * - Validación de datos de entrada
 * - Separación de la lógica de presentación de la lógica de negocio
 * - Estructura clara para la creación de cursos
 */
@Getter
@Setter
public class CourseCreateDto {
    
    /**
     * Título del curso. Campo obligatorio.
     */
    private String title;
    
    /**
     * Descripción del curso. Campo obligatorio.
     */
    private String description;
    
    /**
     * Indica si el curso estará activo por defecto.
     * Por defecto es true.
     */
    private boolean isActive = true;
}
