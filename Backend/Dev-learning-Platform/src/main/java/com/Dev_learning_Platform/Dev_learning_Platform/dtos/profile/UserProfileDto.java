package com.Dev_learning_Platform.Dev_learning_Platform.dtos.profile;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private Long id;
    private String userName;
    private String lastName;
    private String email;
    private User.Role role;
    private boolean isActive;
    private String profileImageUrl;

    public static UserProfileDto fromEntity(User user) {
        return UserProfileDto.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .isActive(user.isActive())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
