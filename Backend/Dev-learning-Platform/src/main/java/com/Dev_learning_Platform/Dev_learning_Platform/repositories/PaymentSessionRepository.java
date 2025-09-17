package com.Dev_learning_Platform.Dev_learning_Platform.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Dev_learning_Platform.Dev_learning_Platform.models.PaymentSession;

public interface PaymentSessionRepository extends JpaRepository<PaymentSession, Long> {
    Optional<PaymentSession> findByStripeSessionId(String stripeSessionId);
    List<PaymentSession> findByUserId(Long userId);
    List<PaymentSession> findByCourseId(Long courseId);
    List<PaymentSession> findByStatus(PaymentSession.Status status);
}
