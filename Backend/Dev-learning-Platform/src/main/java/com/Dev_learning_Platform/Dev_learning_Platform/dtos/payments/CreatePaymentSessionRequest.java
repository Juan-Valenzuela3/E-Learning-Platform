package com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CreatePaymentSessionRequest {

    @NotNull(message = "Course ID es requerido")
    @Positive(message = "Course ID debe ser positivo")
    private Long courseId;

    @NotNull(message = "User ID es requerido")
    @Positive(message = "User ID debe ser positivo")
    private Long userId;

    private String successUrl;
    private String cancelUrl;
}