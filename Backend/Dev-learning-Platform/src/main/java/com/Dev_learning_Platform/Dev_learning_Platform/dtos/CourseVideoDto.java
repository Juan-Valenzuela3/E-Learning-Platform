package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CourseVideoDto {
    
    @NotBlank(message = "El título del video es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String title;
    
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    @NotBlank(message = "La URL de YouTube es obligatoria")
    @Size(max = 500, message = "La URL no puede exceder 500 caracteres")
    private String youtubeUrl;
    
    @NotNull(message = "El índice de orden es obligatorio")
    @Positive(message = "El índice de orden debe ser un número positivo")
    private Integer orderIndex;
    
    @Positive(message = "La duración debe ser un número positivo")
    private Integer durationSeconds;
    
    private Long courseId;
}
