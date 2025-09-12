package com.Dev_learning_Platform.Dev_learning_Platform.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

/**
 * Entidad para manejar videos individuales de YouTube dentro de los cursos.
 * Cada video representa una lección específica del curso.
 */
@Entity
@Table(name = "course_videos")
@Getter
@Setter
public class CourseVideo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "description", length = 1000)
    private String description;
    
    @Column(name = "youtube_url", nullable = false, length = 500)
    private String youtubeUrl;
    
    @Column(name = "youtube_video_id", nullable = false, length = 50)
    private String youtubeVideoId;
    
    @Column(name = "order_index", nullable = false)
    private Integer orderIndex;
    
    @Column(name = "duration_seconds")
    private Integer durationSeconds;
    
    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    public static String extractVideoId(String youtubeUrl) {
        if (youtubeUrl == null || youtubeUrl.trim().isEmpty()) {
            return null;
        }
        
        String videoId = null;
        
        // Patrones comunes de URLs de YouTube
        if (youtubeUrl.contains("youtube.com/watch?v=")) {
            videoId = youtubeUrl.substring(youtubeUrl.indexOf("v=") + 2);
            if (videoId.contains("&")) {
                videoId = videoId.substring(0, videoId.indexOf("&"));
            }
        } else if (youtubeUrl.contains("youtu.be/")) {
            videoId = youtubeUrl.substring(youtubeUrl.indexOf("youtu.be/") + 9);
            if (videoId.contains("?")) {
                videoId = videoId.substring(0, videoId.indexOf("?"));
            }
        } else if (youtubeUrl.contains("youtube.com/embed/")) {
            videoId = youtubeUrl.substring(youtubeUrl.indexOf("embed/") + 6);
            if (videoId.contains("?")) {
                videoId = videoId.substring(0, videoId.indexOf("?"));
            }
        }
        
        return videoId;
    }
}
