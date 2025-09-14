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
import org.springframework.web.bind.annotation.RestController;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseVideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.services.CourseVideoService;
import com.Dev_learning_Platform.Dev_learning_Platform.services.UserService;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/course-videos")
@RequiredArgsConstructor
public class CourseVideoController {

    private final CourseVideoService courseVideoService;
    private final UserService userService;

    /**
     * Extrae el ID del usuario desde el objeto de autenticación
     * 
     * @param authentication Objeto de autenticación de Spring Security
     * @return ID del usuario o null si no se puede obtener
     */
    private Long getUserIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }

        try {
            Object principal = authentication.getPrincipal();

            // Si el principal es un User, extraer el ID directamente
            if (principal instanceof User) {
                return ((User) principal).getId();
            }

            // Si el principal es un UserDetails personalizado, obtener el ID por email
            if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
                String username =
                        ((org.springframework.security.core.userdetails.UserDetails) principal)
                                .getUsername();
                User user = userService.findByEmail(username);
                return user != null ? user.getId() : null;
            }

            return null;
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseVideo> addVideoToCourse(@RequestBody CourseVideoDto videoDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long instructorId = getUserIdFromAuthentication(authentication);

        if (instructorId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        CourseVideo video = courseVideoService.addVideoToCourse(videoDto, instructorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(video);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseVideo>> getVideosByCourse(@PathVariable Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = null;

        if (authentication != null && authentication.isAuthenticated()) {
            userId = getUserIdFromAuthentication(authentication);
        }

        List<CourseVideo> videos = courseVideoService.getVideosByCourse(courseId, userId);
        return ResponseEntity.ok(videos);
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<CourseVideo> getVideoById(@PathVariable Long videoId) {
        CourseVideo video = courseVideoService.getVideoById(videoId);
        return ResponseEntity.ok(video);
    }

    @PutMapping("/{videoId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<CourseVideo> updateVideo(@PathVariable Long videoId,
            @RequestBody CourseVideoDto videoDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long instructorId = getUserIdFromAuthentication(authentication);

        if (instructorId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        CourseVideo video = courseVideoService.updateVideo(videoId, videoDto, instructorId);
        return ResponseEntity.ok(video);
    }

    @DeleteMapping("/{videoId}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long instructorId = getUserIdFromAuthentication(authentication);

        if (instructorId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        courseVideoService.deleteVideo(videoId, instructorId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/course/{courseId}/reorder")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Void> reorderVideos(@PathVariable Long courseId,
            @RequestBody List<Long> videoIds) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long instructorId = getUserIdFromAuthentication(authentication);

        if (instructorId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        courseVideoService.reorderVideos(courseId, videoIds, instructorId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/course/{courseId}/can-manage")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Boolean> canManageVideos(@PathVariable Long courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = getUserIdFromAuthentication(authentication);

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        boolean canManage = courseVideoService.canManageVideos(courseId, userId);
        return ResponseEntity.ok(canManage);
    }
}
