package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CourseCreateDto {
    
    @NotBlank(message = "El título es obligatorio")
    @Size(max = 200, message = "El título no puede exceder 200 caracteres")
    private String title;
    
    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String description;
    
    @Size(max = 255, message = "La descripción corta no puede exceder 255 caracteres")
    private String shortDescription;
    
    @NotNull(message = "El ID del instructor es obligatorio")
    private Long instructorId;
    
    @NotNull(message = "El ID de la categoría es obligatorio")
    private Long categoryId;
    
    @NotNull(message = "El ID de la subcategoría es obligatorio")
    private Long subcategoryId;
    
    private List<@Pattern(regexp = "^https://(?:www\\.)?youtube\\.com/watch\\?v=[a-zA-Z0-9_-]+$", 
                         message = "URL de YouTube inválida") String> youtubeUrls;
    
    @Pattern(regexp = "^https?://.*\\.(jpg|jpeg|png|gif|webp)$", 
             message = "URL de thumbnail debe ser una imagen válida")
    private String thumbnailUrl;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
    @Digits(integer = 6, fraction = 2, message = "Formato de precio inválido")
    private BigDecimal price;
    
    private Boolean isPremium = false;
    
    private Boolean isPublished = false;
    
    private Boolean isActive = true;
    
    @Min(value = 1, message = "Las horas estimadas deben ser al menos 1")
    @Max(value = 1000, message = "Las horas estimadas no pueden exceder 1000")
    private Integer estimatedHours;
}