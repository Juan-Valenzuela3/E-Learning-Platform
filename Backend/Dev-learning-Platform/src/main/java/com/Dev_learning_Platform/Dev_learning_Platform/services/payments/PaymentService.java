package com.Dev_learning_Platform.Dev_learning_Platform.services.payments;

import java.util.List;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Payment;

public interface PaymentService {
    Payment savePayment(Payment payment);
    List<Payment> getPaymentsByUserId(Long userId);
    List<Payment> getPaymentsByCourseId(Long courseId);
    List<Payment> getPaymentsByStatus(Payment.Status status);
    Payment getPaymentById(Long id);
}
