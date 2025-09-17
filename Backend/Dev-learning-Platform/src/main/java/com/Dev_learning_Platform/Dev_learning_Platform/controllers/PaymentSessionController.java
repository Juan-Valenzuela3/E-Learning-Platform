package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.models.PaymentSession;
import com.Dev_learning_Platform.Dev_learning_Platform.services.payments.PaymentSessionService;

@RestController
@RequestMapping("/api/payment-sessions")
public class PaymentSessionController {

    private final PaymentSessionService paymentSessionService;

    public PaymentSessionController(PaymentSessionService paymentSessionService) {
        this.paymentSessionService = paymentSessionService;
    }

    @PostMapping
    public ResponseEntity<PaymentSession> createPaymentSession(@RequestBody PaymentSession paymentSession) {
        PaymentSession savedSession = paymentSessionService.savePaymentSession(paymentSession);
        return ResponseEntity.ok(savedSession);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentSession> getPaymentSessionById(@PathVariable Long id) {
        PaymentSession session = paymentSessionService.getPaymentSessionById(id);
        return session != null ? ResponseEntity.ok(session) : ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PaymentSession>> getSessionsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentSessionService.getPaymentSessionsByUserId(userId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<PaymentSession>> getSessionsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(paymentSessionService.getPaymentSessionsByCourseId(courseId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PaymentSession>> getSessionsByStatus(@PathVariable PaymentSession.Status status) {
        return ResponseEntity.ok(paymentSessionService.getPaymentSessionsByStatus(status));
    }
}
