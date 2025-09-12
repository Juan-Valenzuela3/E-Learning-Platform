package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseVideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseVideoService;

import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para manejar videos de YouTube en los cursos.
 * Proporciona endpoints para agregar, editar y gestionar videos.
 */
@RestController
@RequestMapping("/api/course-videos")
@RequiredArgsConstructor
public class CourseVideoController {
    
    private final CourseVideoService courseVideoService;
    
    /**
     * Agrega un nuevo video a un curso.
     * Solo los instructores del curso pueden agregar videos.
     */
    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseVideo> addVideoToCourse(@RequestBody CourseVideoDto videoDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long instructorId = Long.parseLong(authentication.getName());
            
            CourseVideo video = courseVideoService.addVideoToCourse(videoDto, instructorId);
            return ResponseEntity.status(HttpStatus.CREATED).body(video);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene todos los videos de un curso.
     * Los estudiantes deben estar inscritos para ver los videos.
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseVideo>> getVideosByCourse(@PathVariable Long courseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = null;
            
            if (authentication != null && authentication.isAuthenticated()) {
                userId = Long.parseLong(authentication.getName());
            }
            
            List<CourseVideo> videos = courseVideoService.getVideosByCourse(courseId, userId);
            return ResponseEntity.ok(videos);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Obtiene un video específico por su ID.
     */
    @GetMapping("/{videoId}")
    public ResponseEntity<CourseVideo> getVideoById(@PathVariable Long videoId) {
        try {
            CourseVideo video = courseVideoService.getVideoById(videoId);
            return ResponseEntity.ok(video);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Actualiza un video existente.
     * Solo los instructores del curso pueden editar videos.
     */
    @PutMapping("/{videoId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseVideo> updateVideo(@PathVariable Long videoId, @RequestBody CourseVideoDto videoDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long instructorId = Long.parseLong(authentication.getName());
            
            CourseVideo video = courseVideoService.updateVideo(videoId, videoDto, instructorId);
            return ResponseEntity.ok(video);
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Elimina un video (lo marca como inactivo).
     * Solo los instructores del curso pueden eliminar videos.
     */
    @DeleteMapping("/{videoId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long instructorId = Long.parseLong(authentication.getName());
            
            courseVideoService.deleteVideo(videoId, instructorId);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Reordena los videos de un curso.
     * Solo los instructores del curso pueden reordenar videos.
     */
    @PutMapping("/course/{courseId}/reorder")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> reorderVideos(@PathVariable Long courseId, @RequestBody List<Long> videoIds) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long instructorId = Long.parseLong(authentication.getName());
            
            courseVideoService.reorderVideos(courseId, videoIds, instructorId);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Verifica si un usuario puede gestionar videos de un curso.
     */
    @GetMapping("/course/{courseId}/can-manage")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Boolean> canManageVideos(@PathVariable Long courseId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Long userId = Long.parseLong(authentication.getName());
            
            boolean canManage = courseVideoService.canManageVideos(courseId, userId);
            return ResponseEntity.ok(canManage);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
}
