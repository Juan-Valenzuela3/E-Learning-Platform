
package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseCreateDto;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CoursePublicDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.FileUploadService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserService userService;
    private final FileUploadService fileUploadService;

    /**
     * Sube una imagen de portada para un curso (Object Storage OCI)
     * Solo para instructores/admins autenticados
     * @param file Archivo de imagen (JPG, JPEG, PNG, máx. 5MB)
     * @return URL pública de la imagen subida
     */
    @PostMapping("/upload-image")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadCourseImage(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Validar tipo y tamaño (puedes refinar según FileUploadService)
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("No se envió ningún archivo");
            }
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/jpg"))) {
                return ResponseEntity.badRequest().body("Tipo de archivo no permitido. Solo JPG, JPEG, PNG");
            }
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("El archivo excede el tamaño máximo permitido (5 MB)");
            }

            // Subir a Object Storage (reutiliza FileUploadService, crea método uploadCourseImage)
            String imageUrl = fileUploadService.uploadCourseImage(file, userDetails.getUsername());
            return ResponseEntity.ok().body(new ImageUploadResponse(imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la imagen: " + e.getMessage());
        }
    }

    // DTO de respuesta para la URL
    public static class ImageUploadResponse {
        public String url;
        public ImageUploadResponse(String url) { this.url = url; }
        public String getUrl() { return url; }
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody CourseCreateDto courseDto) {
        Course createdCourse = courseService.createCourse(courseDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
    }

    @GetMapping
    public ResponseEntity<Page<CoursePublicDto>> getPublicCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        // Limitar el tamaño máximo de página para evitar sobrecarga
        size = Math.min(size, 100);
        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Course> courses = courseService.getPublicCourses(pageable);
        // Mapear a DTOs
        Page<CoursePublicDto> dtoPage = courses.map(course -> {
            CoursePublicDto dto = new CoursePublicDto();
            dto.setId(course.getId());
            dto.setTitle(course.getTitle());
            dto.setDescription(course.getDescription());
            dto.setShortDescription(course.getShortDescription());
            dto.setThumbnailUrl(course.getThumbnailUrl());
            dto.setPrice(course.getPrice());
            dto.setIsPremium(course.getIsPremium());
            dto.setIsPublished(course.getIsPublished());
            dto.setIsActive(course.getIsActive());
            dto.setEstimatedHours(course.getEstimatedHours());
            return dto;
        });
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.findById(id);
        return ResponseEntity.ok(course);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<CoursePublicDto>> getCoursesByInstructor(@PathVariable Long instructorId, Authentication authentication) {
        // ...verificación de permisos...
        List<Course> courses = courseService.getCoursesByInstructor(instructorId);
        List<CoursePublicDto> dtos = courses.stream().map(course -> {
            CoursePublicDto dto = new CoursePublicDto();
            dto.setId(course.getId());
            dto.setTitle(course.getTitle());
            dto.setDescription(course.getDescription());
            dto.setShortDescription(course.getShortDescription());
            dto.setThumbnailUrl(course.getThumbnailUrl());
            dto.setPrice(course.getPrice());
            dto.setIsPremium(course.getIsPremium());
            dto.setIsPublished(course.getIsPublished());
            dto.setIsActive(course.getIsActive());
            dto.setEstimatedHours(course.getEstimatedHours());
            return dto;
    }).toList();
    return ResponseEntity.ok(dtos);
}

    @GetMapping("/admin/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getAllActiveCourses() {
        List<Course> courses = courseService.getAllActiveCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable Long categoryId) {
        try {
            List<Course> courses = courseService.getCoursesByCategory(categoryId);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/subcategory/{subcategoryId}")
    public ResponseEntity<List<Course>> getCoursesBySubcategory(@PathVariable Long subcategoryId) {
        try {
            List<Course> courses = courseService.getCoursesBySubcategory(subcategoryId);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/category/{categoryId}/subcategory/{subcategoryId}")
    public ResponseEntity<List<Course>> getCoursesByCategoryAndSubcategory(
            @PathVariable Long categoryId, 
            @PathVariable Long subcategoryId) {
        try {
            List<Course> courses = courseService.getCoursesByCategoryAndSubcategory(categoryId, subcategoryId);
            return ResponseEntity.ok(courses);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Long courseId,
            @Valid @RequestBody CourseCreateDto courseDto) {
        Course updatedCourse = courseService.updateCourse(courseId, courseDto);
        return ResponseEntity.ok(updatedCourse);
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long courseId) {
        try {
            User authenticatedUser = userService.getAuthenticatedUser();
            courseService.deleteCourse(courseId, authenticatedUser.getId());
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{courseId}/publish")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> togglePublishStatus(@PathVariable Long courseId) {
        Course updatedCourse = courseService.togglePublishStatus(courseId);
        return ResponseEntity.ok(updatedCourse);
    }
}
