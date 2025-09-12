package com.Dev_learning_Platform.Dev_learning_Platform.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.CourseVideoDto;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.CourseVideo;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseVideoRepository;

import lombok.RequiredArgsConstructor;

/**
 * Servicio para manejar videos de YouTube en los cursos.
 * Proporciona funcionalidades para agregar, editar y gestionar videos.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseVideoService {

    private final CourseVideoRepository courseVideoRepository;
    private final CourseService courseService;
    private final EnrollmentService enrollmentService;
    private final UserService userService;

    /**
     * Agrega un nuevo video a un curso.
     * Solo los instructores del curso pueden agregar videos.
     */
    @Transactional
    public CourseVideo addVideoToCourse(CourseVideoDto videoDto, Long instructorId) {
        Course course = courseService.findById(videoDto.getCourseId());
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede agregar videos");
        }

        String videoId = CourseVideo.extractVideoId(videoDto.getYoutubeUrl());
        if (videoId == null) {
            throw new IllegalArgumentException("URL de YouTube inválida");
        }

        if (videoDto.getDurationSeconds() != null) {
            if (videoDto.getDurationSeconds() > 1800) {
                throw new IllegalArgumentException("La duración del video no puede exceder 30 minutos");
            }
        }

        CourseVideo video = new CourseVideo();
        video.setTitle(videoDto.getTitle());
        video.setDescription(videoDto.getDescription());
        video.setYoutubeUrl(videoDto.getYoutubeUrl());
        video.setYoutubeVideoId(videoId);
        video.setOrderIndex(videoDto.getOrderIndex());
        video.setDurationSeconds(videoDto.getDurationSeconds());
        video.setCourse(course);
        
        video.setThumbnailUrl("https://img.youtube.com/vi/" + videoId + "/maxresdefault.jpg");

        return courseVideoRepository.save(video);
    }

    public List<CourseVideo> getVideosByCourse(Long courseId, Long studentId) {
        // Si hay un estudiante autenticado, verificar que esté inscrito
        if (studentId != null) {
            User user = userService.findById(studentId);
            
            // Si es instructor del curso, permitir acceso
            Course course = courseService.findById(courseId);
            if (course.getInstructor().getId().equals(studentId)) {
                return courseVideoRepository.findByCourseIdAndIsActiveOrderByOrderIndexAsc(courseId, true);
            }
            
            // Si es estudiante, verificar que esté inscrito
            if (user.getRole() == User.Role.STUDENT) {
                if (!enrollmentService.isStudentEnrolled(studentId, courseId)) {
                    throw new SecurityException("Debes estar inscrito en el curso para acceder a los videos");
                }
            }
        }
        
        return courseVideoRepository.findByCourseIdAndIsActiveOrderByOrderIndexAsc(courseId, true);
    }

    public List<CourseVideo> getVideosByCourse(Long courseId) {
        return courseVideoRepository.findByCourseIdAndIsActiveOrderByOrderIndexAsc(courseId, true);
    }

    public CourseVideo getVideoById(Long videoId) {
        return courseVideoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Video no encontrado con ID: " + videoId));
    }

    /**
     * Actualiza un video existente.
     * Solo los instructores del curso pueden editar videos.
     */
    @Transactional
    public CourseVideo updateVideo(Long videoId, CourseVideoDto videoDto, Long instructorId) {
        CourseVideo existingVideo = getVideoById(videoId);
        
        if (!existingVideo.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede editar videos");
        }

        if (videoDto.getTitle() != null) {
            existingVideo.setTitle(videoDto.getTitle());
        }
        if (videoDto.getDescription() != null) {
            existingVideo.setDescription(videoDto.getDescription());
        }
        if (videoDto.getOrderIndex() != null) {
            existingVideo.setOrderIndex(videoDto.getOrderIndex());
        }
        if (videoDto.getYoutubeUrl() != null) {
            String newVideoId = CourseVideo.extractVideoId(videoDto.getYoutubeUrl());
            if (newVideoId == null) {
                throw new IllegalArgumentException("URL de YouTube inválida");
            }
            existingVideo.setYoutubeUrl(videoDto.getYoutubeUrl());
            existingVideo.setYoutubeVideoId(newVideoId);
            existingVideo.setThumbnailUrl("https://img.youtube.com/vi/" + newVideoId + "/maxresdefault.jpg");
        }
        
        if (videoDto.getDurationSeconds() != null) {
            if (videoDto.getDurationSeconds() > 1800) {
                throw new IllegalArgumentException("La duración del video no puede exceder 30 minutos");
            }
            existingVideo.setDurationSeconds(videoDto.getDurationSeconds());
        }

        return courseVideoRepository.save(existingVideo);
    }

    @Transactional
    public void deleteVideo(Long videoId, Long instructorId) {
        CourseVideo video = getVideoById(videoId);
        
        if (!video.getCourse().getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede eliminar videos");
        }

        video.setIsActive(false);
        courseVideoRepository.save(video);
    }

    @Transactional
    public void reorderVideos(Long courseId, List<Long> videoIds, Long instructorId) {
        Course course = courseService.findById(courseId);
        if (!course.getInstructor().getId().equals(instructorId)) {
            throw new SecurityException("Solo el instructor del curso puede reordenar videos");
        }

        for (int i = 0; i < videoIds.size(); i++) {
            Optional<CourseVideo> videoOpt = courseVideoRepository.findById(videoIds.get(i));
            if (videoOpt.isPresent()) {
                CourseVideo video = videoOpt.get();
                if (video.getCourse().getId().equals(courseId)) {
                    video.setOrderIndex(i + 1);
                    courseVideoRepository.save(video);
                }
            }
        }
    }

    public boolean canManageVideos(Long courseId, Long userId) {
        try {
            Course course = courseService.findById(courseId);
            return course.getInstructor().getId().equals(userId);
        } catch (Exception e) {
            return false;
        }
    }

    public static int getMaxVideoDuration() {
        return 1800;
    }

    public static int getRecommendedVideoDuration() {
        return 900;
    }

    public static boolean isOptimalDuration(int durationSeconds) {
        return durationSeconds >= 300 && durationSeconds <= 1200;
    }
}
