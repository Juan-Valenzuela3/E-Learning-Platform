package com.Dev_learning_Platform.Dev_learning_Platform.dtos;

import com.Dev_learning_Platform.Dev_learning_Platform.models.User;

import lombok.Getter;
import lombok.Setter;



@Getter
@Setter
public class UserRegisterDto {
    private String userName;
    private String lastName;
    private String email;
    private String password;
    private User.Role role;

    public static User toEntity(UserRegisterDto dto) {
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }
}
