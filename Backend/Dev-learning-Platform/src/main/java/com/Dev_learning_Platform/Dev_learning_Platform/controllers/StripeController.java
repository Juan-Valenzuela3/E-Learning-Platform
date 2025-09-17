package com.Dev_learning_Platform.Dev_learning_Platform.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments.CreatePaymentSessionRequest;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments.CreatePaymentSessionResponse;
import com.Dev_learning_Platform.Dev_learning_Platform.services.payments.StripeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/stripe")
@RequiredArgsConstructor
@Slf4j
public class StripeController {

    private final StripeService stripeService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<CreatePaymentSessionResponse> createCheckoutSession(
            @Valid @RequestBody CreatePaymentSessionRequest request) {
        try {
            CreatePaymentSessionResponse response = stripeService.createCheckoutSession(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error creando sesión de checkout: {}", e.getMessage());
            CreatePaymentSessionResponse errorResponse = CreatePaymentSessionResponse.builder()
                    .message("Error al crear sesión de pago: " + e.getMessage())
                    .build();
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            log.error("Error inesperado creando sesión de checkout: {}", e.getMessage(), e);
            CreatePaymentSessionResponse errorResponse = CreatePaymentSessionResponse.builder()
                    .message("Error interno del servidor")
                    .build();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            boolean processed = stripeService.processWebhook(payload, sigHeader);
            if (processed) {
                return ResponseEntity.ok("Webhook procesado exitosamente");
            } else {
                return ResponseEntity.badRequest().body("Error procesando webhook");
            }
        } catch (Exception e) {
            log.error("Error procesando webhook de Stripe: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error interno procesando webhook");
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Stripe service is healthy");
    }
}