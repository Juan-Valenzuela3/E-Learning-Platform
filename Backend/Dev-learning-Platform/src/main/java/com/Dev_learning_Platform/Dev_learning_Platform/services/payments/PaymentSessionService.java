package com.Dev_learning_Platform.Dev_learning_Platform.services.payments;

import java.util.List;

import com.Dev_learning_Platform.Dev_learning_Platform.models.PaymentSession;

public interface PaymentSessionService {
    PaymentSession savePaymentSession(PaymentSession paymentSession);
    List<PaymentSession> getPaymentSessionsByUserId(Long userId);
    List<PaymentSession> getPaymentSessionsByCourseId(Long courseId);
    List<PaymentSession> getPaymentSessionsByStatus(PaymentSession.Status status);
    PaymentSession getPaymentSessionById(Long id);
}
