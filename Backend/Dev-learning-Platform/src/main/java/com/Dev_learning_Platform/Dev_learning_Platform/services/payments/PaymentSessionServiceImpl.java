package com.Dev_learning_Platform.Dev_learning_Platform.services.payments;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Dev_learning_Platform.Dev_learning_Platform.models.PaymentSession;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.PaymentSessionRepository;

@Service
public class PaymentSessionServiceImpl implements PaymentSessionService {

    private final PaymentSessionRepository paymentSessionRepository;

    public PaymentSessionServiceImpl(PaymentSessionRepository paymentSessionRepository) {
        this.paymentSessionRepository = paymentSessionRepository;
    }

    @Override
    public PaymentSession savePaymentSession(PaymentSession paymentSession) {
        return paymentSessionRepository.save(paymentSession);
    }

    @Override
    public List<PaymentSession> getPaymentSessionsByUserId(Long userId) {
        return paymentSessionRepository.findByUserId(userId);
    }

    @Override
    public List<PaymentSession> getPaymentSessionsByCourseId(Long courseId) {
        return paymentSessionRepository.findByCourseId(courseId);
    }

    @Override
    public List<PaymentSession> getPaymentSessionsByStatus(PaymentSession.Status status) {
        return paymentSessionRepository.findByStatus(status);
    }

    @Override
    public PaymentSession getPaymentSessionById(Long id) {
        return paymentSessionRepository.findById(id).orElse(null);
    }
}
