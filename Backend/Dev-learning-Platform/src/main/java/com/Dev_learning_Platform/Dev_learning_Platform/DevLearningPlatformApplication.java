package com.Dev_learning_Platform.Dev_learning_Platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class DevLearningPlatformApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(DevLearningPlatformApplication.class, args);
    }

}
