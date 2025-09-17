package com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StripeWebhookEvent {


    private String type;
    private String objectId;
    private Object data;
    private String eventId;
}