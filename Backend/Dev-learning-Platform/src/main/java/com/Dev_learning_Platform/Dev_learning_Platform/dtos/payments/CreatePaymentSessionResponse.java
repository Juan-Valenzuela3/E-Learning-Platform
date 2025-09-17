package com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CreatePaymentSessionResponse {

    private String sessionId;
    private String checkoutUrl;
    private Long paymentSessionId;
    private String message;
}