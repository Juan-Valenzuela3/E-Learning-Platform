package com.Dev_learning_Platform.Dev_learning_Platform.services.payments;

import java.util.List;

import org.springframework.stereotype.Service;

import com.Dev_learning_Platform.Dev_learning_Platform.models.Payment;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentServiceImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getPaymentsByUserId(Long userId) {
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public List<Payment> getPaymentsByCourseId(Long courseId) {
        return paymentRepository.findByCourseId(courseId);
    }

    @Override
    public List<Payment> getPaymentsByStatus(Payment.Status status) {
        return paymentRepository.findByStatus(status.name());
    }

    @Override
    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id).orElse(null);
    }
}
