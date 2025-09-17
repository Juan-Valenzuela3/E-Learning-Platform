package com.Dev_learning_Platform.Dev_learning_Platform.services.payments;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments.CreatePaymentSessionRequest;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments.CreatePaymentSessionResponse;
import com.stripe.model.Event;

/**
 * Interfaz para el servicio de integración con Stripe.
 */
public interface StripeService {

    CreatePaymentSessionResponse createCheckoutSession(CreatePaymentSessionRequest request);
    boolean processWebhook(String payload, String sigHeader);
    void handleCheckoutSessionCompleted(Event event);
    void handlePaymentIntentSucceeded(Event event);
}