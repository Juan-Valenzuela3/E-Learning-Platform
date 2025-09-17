package com.Dev_learning_Platform.Dev_learning_Platform.services.payments;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments.CreatePaymentSessionRequest;
import com.Dev_learning_Platform.Dev_learning_Platform.dtos.payments.CreatePaymentSessionResponse;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Course;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Enrollment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.Payment;
import com.Dev_learning_Platform.Dev_learning_Platform.models.PaymentSession;
import com.Dev_learning_Platform.Dev_learning_Platform.models.User;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.CourseRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.EnrollmentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.PaymentRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.PaymentSessionRepository;
import com.Dev_learning_Platform.Dev_learning_Platform.repositories.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class StripeServiceImpl implements StripeService {

    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final PaymentSessionRepository paymentSessionRepository;
    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public CreatePaymentSessionResponse createCheckoutSession(CreatePaymentSessionRequest request) {
        try {
            // Buscar curso y usuario
            Course course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Curso no encontrado"));
            
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Verificar si el usuario ya está inscrito
            boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(
                    request.getUserId(), request.getCourseId());
            
            if (alreadyEnrolled) {
                throw new RuntimeException("El usuario ya está inscrito en este curso");
            }

            // Crear sesión de Stripe
            SessionCreateParams params = SessionCreateParams.builder()
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(getSuccessUrl(request.getSuccessUrl()))
                    .setCancelUrl(getCancelUrl(request.getCancelUrl()))
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("usd")
                                                    .setUnitAmount(course.getPrice().multiply(BigDecimal.valueOf(100)).longValue())
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(course.getTitle())
                                                                    .setDescription(course.getShortDescription())
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .putMetadata("course_id", course.getId().toString())
                    .putMetadata("user_id", user.getId().toString())
                    .putMetadata("user_email", user.getEmail())
                    .build();

            Session session = Session.create(params);

            // Guardar sesión en base de datos
            PaymentSession paymentSession = new PaymentSession();
            paymentSession.setStripeSessionId(session.getId());
            paymentSession.setUser(user);
            paymentSession.setCourse(course);
            paymentSession.setStatus(PaymentSession.Status.CREATED);
            paymentSession.setCreatedAt(LocalDateTime.now());
            paymentSession.setUpdatedAt(LocalDateTime.now());

            PaymentSession savedSession = paymentSessionRepository.save(paymentSession);

            log.info("Sesión de pago creada: {} para usuario: {} y curso: {}", 
                    session.getId(), user.getId(), course.getId());

            return CreatePaymentSessionResponse.builder()
                    .sessionId(session.getId())
                    .checkoutUrl(session.getUrl())
                    .paymentSessionId(savedSession.getId())
                    .message("Sesión de pago creada exitosamente")
                    .build();

        } catch (StripeException e) {
            log.error("Error creando sesión de Stripe: {}", e.getMessage(), e);
            throw new RuntimeException("Error al crear sesión de pago: " + e.getMessage());
        }
    }

    @Override
    public boolean processWebhook(String payload, String sigHeader) {
        try {
            Event event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            
            log.info("Procesando webhook de Stripe: {}", event.getType());

            switch (event.getType()) {
                case "checkout.session.completed":
                    handleCheckoutSessionCompleted(event);
                    break;
                case "payment_intent.succeeded":
                    handlePaymentIntentSucceeded(event);
                    break;
                default:
                    log.info("Evento no manejado: {}", event.getType());
            }

            return true;
        } catch (Exception e) {
            log.error("Error procesando webhook: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public void handleCheckoutSessionCompleted(Event event) {
        try {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session == null) {
                log.error("No se pudo deserializar la sesión del evento");
                return;
            }

            String courseIdStr = session.getMetadata().get("course_id");
            String userIdStr = session.getMetadata().get("user_id");

            if (courseIdStr == null || userIdStr == null) {
                log.error("Metadata faltante en la sesión: {}", session.getId());
                return;
            }

            Long courseId = Long.parseLong(courseIdStr);
            Long userId = Long.parseLong(userIdStr);

            // Buscar la sesión en la base de datos
            Optional<PaymentSession> paymentSessionOpt = paymentSessionRepository
                    .findByStripeSessionId(session.getId());

            if (paymentSessionOpt.isEmpty()) {
                log.error("Sesión de pago no encontrada: {}", session.getId());
                return;
            }

            PaymentSession paymentSession = paymentSessionOpt.get();
            paymentSession.setStatus(PaymentSession.Status.COMPLETED);
            paymentSession.setUpdatedAt(LocalDateTime.now());
            paymentSessionRepository.save(paymentSession);

            // Crear registro de pago
            Course course = courseRepository.findById(courseId).orElse(null);
            User user = userRepository.findById(userId).orElse(null);

            if (course == null || user == null) {
                log.error("Curso o usuario no encontrado para el pago");
                return;
            }

            Payment payment = new Payment();
            payment.setStripePaymentId(session.getPaymentIntent());
            payment.setUser(user);
            payment.setCourse(course);
            payment.setPaymentSession(paymentSession);
            payment.setAmount(course.getPrice());
            payment.setStatus(Payment.Status.COMPLETED);
            payment.setCreatedAt(LocalDateTime.now());
            payment.setUpdatedAt(LocalDateTime.now());

            Payment savedPayment = paymentRepository.save(payment);

            // Crear inscripción
            createEnrollment(user, course, savedPayment);

            log.info("Pago completado exitosamente para usuario: {} y curso: {}", userId, courseId);

        } catch (Exception e) {
            log.error("Error manejando checkout session completed: {}", e.getMessage(), e);
        }
    }

    @Override
    public void handlePaymentIntentSucceeded(Event event) {
        log.info("Payment intent succeeded: {}", event.getId());
        // Lógica adicional si es necesaria
    }

    private void createEnrollment(User user, Course course, Payment payment) {
        try {
            // Verificar si ya existe la inscripción
            boolean alreadyEnrolled = enrollmentRepository.existsByStudentIdAndCourseId(
                    user.getId(), course.getId());

            if (!alreadyEnrolled) {
                Enrollment enrollment = new Enrollment();
                enrollment.setStudent(user);
                enrollment.setCourse(course);
                enrollment.setPayment(payment);
                enrollment.setEnrolledAt(LocalDateTime.now());
                
                enrollmentRepository.save(enrollment);
                
                log.info("Inscripción creada para usuario: {} en curso: {}", 
                        user.getId(), course.getId());
            } else {
                log.warn("El usuario {} ya está inscrito en el curso {}", 
                        user.getId(), course.getId());
            }
        } catch (Exception e) {
            log.error("Error creando inscripción: {}", e.getMessage(), e);
        }
    }

    private String getSuccessUrl(String customUrl) {
        return customUrl != null ? customUrl : frontendUrl + "/payment/success";
    }

    private String getCancelUrl(String customUrl) {
        return customUrl != null ? customUrl : frontendUrl + "/payment/cancel";
    }
}