# 💳 Stripe Payment API Documentation - E-Learning Platform

## 📋 Información General

**Base URL:** `http://localhost:8080`  
**Versión:** 1.0  
**Tipo de Autenticación:** JWT (JSON Web Tokens)  
**Content-Type:** `application/json`  
**Proveedor de Pagos:** Stripe API v3  

## Comando para ejecutar backend en entorno de desarrollo
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 🏗️ Arquitectura de Pagos

El sistema de pagos integra **Stripe** como proveedor de pagos y maneja el flujo completo desde la creación de sesiones hasta la confirmación de pagos mediante webhooks.

### Flujo de Pago Completo:
1. **Usuario selecciona curso** → Frontend obtiene información del curso
2. **Crear sesión de pago** → `POST /api/stripe/create-checkout-session`
3. **Redirigir a Stripe** → Usuario completa el pago en Stripe Checkout
4. **Webhook confirmation** → Stripe notifica el resultado via webhook
5. **Crear inscripción** → Sistema crea automáticamente la inscripción del usuario

---

## 🎯 Endpoints de Stripe

### 1. Crear Sesión de Checkout
**Endpoint:** `POST /api/stripe/create-checkout-session`  
**Descripción:** Crea una sesión de pago en Stripe para un curso específico  
**Acceso:** Todos los usuarios autenticados (STUDENT, INSTRUCTOR, ADMIN)  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "courseId": 1,
  "userId": 5,
  "successUrl": "https://miapp.com/payment/success",
  "cancelUrl": "https://miapp.com/payment/cancel"
}
```

#### Validaciones:
- **courseId:** Requerido, número positivo, debe existir en la base de datos
- **userId:** Requerido, número positivo, debe existir en la base de datos  
- **successUrl:** Opcional, URL de redirección después del pago exitoso
- **cancelUrl:** Opcional, URL de redirección si el usuario cancela

#### Headers Requeridos:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
Accept: application/json
```

#### Response Exitoso (200 OK):
```json
{
  "sessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
  "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0#fidkdWxOYHwn",
  "paymentSessionId": 123,
  "message": "Sesión de pago creada exitosamente"
}
```

#### Response de Error (400 Bad Request):
```json
{
  "sessionId": null,
  "checkoutUrl": null,
  "paymentSessionId": null,
  "message": "Error al crear sesión de pago: El curso no existe"
}
```

#### Response de Error (401 Unauthorized):
```json
{
  "message": "Token ausente, inválido o expirado",
  "status": 401,
  "timestamp": "2025-01-01T10:00:00"
}
```

#### Response de Error (500 Internal Server Error):
```json
{
  "sessionId": null,
  "checkoutUrl": null,
  "paymentSessionId": null,
  "message": "Error interno del servidor"
}
```

#### Casos de Uso:
- ✅ **Usuario quiere comprar un curso premium**
- ✅ **Usuario ya inscrito quiere acceder nuevamente** (validación automática)
- ❌ **Curso gratuito** (no requiere pago)
- ❌ **Usuario ya tiene acceso** (evita doble pago)

---

### 2. Webhook de Stripe
**Endpoint:** `POST /api/stripe/webhook`  
**Descripción:** Endpoint interno para recibir notificaciones de Stripe sobre el estado de los pagos  
**Acceso:** Solo Stripe (IP whitelisting recomendado en producción)  
**Autenticación:** Stripe Signature Header  

#### Headers Requeridos:
```
Stripe-Signature: t=1640995200,v1=signature_hash
Content-Type: application/json
```

#### Request Body (Ejemplo de pago exitoso):
```json
{
  "id": "evt_1234567890",
  "object": "event",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
      "payment_status": "paid",
      "metadata": {
        "courseId": "1",
        "userId": "5"
      }
    }
  }
}
```

#### Response Exitoso (200 OK):
```json
"Webhook procesado exitosamente"
```

#### Response de Error (400 Bad Request):
```json
"Error procesando webhook"
```

#### Eventos Procesados:
- `checkout.session.completed` - Pago completado exitosamente
- `checkout.session.expired` - Sesión de pago expirada
- `payment_intent.payment_failed` - Pago falló

---

### 3. Health Check de Stripe
**Endpoint:** `GET /api/stripe/health`  
**Descripción:** Verifica que el servicio de Stripe esté funcionando correctamente  
**Acceso:** Público (para monitoreo)  

#### Response Exitoso (200 OK):
```json
"Stripe service is healthy"
```

---

## 💰 Endpoints de Payment

### 4. Crear Pago Manual
**Endpoint:** `POST /api/payments`  
**Descripción:** Crea un registro de pago manualmente (generalmente usado internamente por webhooks)  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "stripePaymentId": "pi_1234567890abcdef",
  "user": {
    "id": 5
  },
  "course": {
    "id": 1
  },
  "amount": 99.99,
  "status": "COMPLETED",
  "paymentData": "{\"method\":\"card\",\"last4\":\"4242\"}"
}
```

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "stripePaymentId": "pi_1234567890abcdef",
  "user": {
    "id": 5,
    "userName": "Juan",
    "email": "juan@example.com"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico",
    "price": 99.99
  },
  "amount": 99.99,
  "status": "COMPLETED",
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00",
  "paymentData": "{\"method\":\"card\",\"last4\":\"4242\"}",
  "enrollment": {
    "id": 10,
    "status": "ACTIVE"
  }
}
```

---

### 5. Obtener Pago por ID
**Endpoint:** `GET /api/payments/{id}`  
**Descripción:** Obtiene la información detallada de un pago específico  
**Acceso:** ADMIN, INSTRUCTOR (propio), STUDENT (propio)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID del pago (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "stripePaymentId": "pi_1234567890abcdef",
  "user": {
    "id": 5,
    "userName": "Juan",
    "email": "juan@example.com"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico",
    "price": 99.99
  },
  "amount": 99.99,
  "status": "COMPLETED",
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Pago no encontrado con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

---

### 6. Obtener Pagos por Usuario
**Endpoint:** `GET /api/payments/user/{userId}`  
**Descripción:** Obtiene todos los pagos realizados por un usuario específico  
**Acceso:** ADMIN, STUDENT (propio)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **userId:** ID del usuario (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "stripePaymentId": "pi_1234567890abcdef",
    "course": {
      "id": 1,
      "title": "Curso de Java Básico",
      "thumbnailUrl": "https://example.com/thumb.jpg"
    },
    "amount": 99.99,
    "status": "COMPLETED",
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "stripePaymentId": "pi_0987654321fedcba",
    "course": {
      "id": 3,
      "title": "Curso de React Avanzado",
      "thumbnailUrl": "https://example.com/thumb2.jpg"
    },
    "amount": 149.99,
    "status": "COMPLETED",
    "createdAt": "2025-01-02T15:30:00.000+00:00"
  }
]
```

---

### 7. Obtener Pagos por Curso
**Endpoint:** `GET /api/payments/course/{courseId}`  
**Descripción:** Obtiene todos los pagos realizados para un curso específico  
**Acceso:** ADMIN, INSTRUCTOR (propietario del curso)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "stripePaymentId": "pi_1234567890abcdef",
    "user": {
      "id": 5,
      "userName": "Juan",
      "email": "juan@example.com"
    },
    "amount": 99.99,
    "status": "COMPLETED",
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 3,
    "stripePaymentId": "pi_abcdef1234567890",
    "user": {
      "id": 8,
      "userName": "María",
      "email": "maria@example.com"
    },
    "amount": 99.99,
    "status": "COMPLETED",
    "createdAt": "2025-01-03T09:15:00.000+00:00"
  }
]
```

---

### 8. Obtener Pagos por Estado
**Endpoint:** `GET /api/payments/status/{status}`  
**Descripción:** Obtiene todos los pagos filtrados por estado  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **status:** Estado del pago - `PENDING`, `COMPLETED`, `REFUNDED`, `FAILED` (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "stripePaymentId": "pi_1234567890abcdef",
    "user": {
      "id": 5,
      "userName": "Juan"
    },
    "course": {
      "id": 1,
      "title": "Curso de Java Básico"
    },
    "amount": 99.99,
    "status": "COMPLETED",
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

---

## 🗂️ Endpoints de Payment Sessions

### 9. Crear Sesión de Pago Manual
**Endpoint:** `POST /api/payment-sessions`  
**Descripción:** Crea una sesión de pago manualmente (uso interno/admin)  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
  "user": {
    "id": 5
  },
  "course": {
    "id": 1
  },
  "status": "CREATED",
  "sessionData": "{\"created_at\":\"2025-01-01T10:00:00Z\"}"
}
```

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
  "user": {
    "id": 5,
    "userName": "Juan"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico"
  },
  "status": "CREATED",
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

---

### 10. Obtener Sesión de Pago por ID
**Endpoint:** `GET /api/payment-sessions/{id}`  
**Descripción:** Obtiene información de una sesión de pago específica  
**Acceso:** ADMIN, STUDENT (propias), INSTRUCTOR (de sus cursos)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la sesión de pago (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
  "user": {
    "id": 5,
    "userName": "Juan",
    "email": "juan@example.com"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico",
    "price": 99.99
  },
  "status": "COMPLETED",
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:05:00.000+00:00",
  "payments": [
    {
      "id": 1,
      "amount": 99.99,
      "status": "COMPLETED"
    }
  ]
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Sesión de pago no encontrada con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

---

### 11. Obtener Sesiones por Usuario
**Endpoint:** `GET /api/payment-sessions/user/{userId}`  
**Descripción:** Obtiene todas las sesiones de pago de un usuario  
**Acceso:** ADMIN, STUDENT (propias)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **userId:** ID del usuario (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
    "course": {
      "id": 1,
      "title": "Curso de Java Básico",
      "price": 99.99
    },
    "status": "COMPLETED",
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "stripeSessionId": "cs_test_b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U1",
    "course": {
      "id": 3,
      "title": "Curso de React Avanzado",
      "price": 149.99
    },
    "status": "EXPIRED",
    "createdAt": "2025-01-02T15:30:00.000+00:00"
  }
]
```

---

### 12. Obtener Sesiones por Curso
**Endpoint:** `GET /api/payment-sessions/course/{courseId}`  
**Descripción:** Obtiene todas las sesiones de pago para un curso específico  
**Acceso:** ADMIN, INSTRUCTOR (propietario del curso)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
    "user": {
      "id": 5,
      "userName": "Juan",
      "email": "juan@example.com"
    },
    "status": "COMPLETED",
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 3,
    "stripeSessionId": "cs_test_c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0u1V2",
    "user": {
      "id": 8,
      "userName": "María",
      "email": "maria@example.com"
    },
    "status": "COMPLETED",
    "createdAt": "2025-01-03T09:15:00.000+00:00"
  }
]
```

---

### 13. Obtener Sesiones por Estado
**Endpoint:** `GET /api/payment-sessions/status/{status}`  
**Descripción:** Obtiene todas las sesiones de pago filtradas por estado  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **status:** Estado de la sesión - `CREATED`, `COMPLETED`, `EXPIRED` (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "stripeSessionId": "cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6q7R8s9T0",
    "user": {
      "id": 5,
      "userName": "Juan"
    },
    "course": {
      "id": 1,
      "title": "Curso de Java Básico"
    },
    "status": "COMPLETED",
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

---

## 📊 Estados y Enumeraciones

### Estados de Payment:
- **PENDING:** Pago iniciado pero no completado
- **COMPLETED:** Pago completado exitosamente
- **REFUNDED:** Pago reembolsado
- **FAILED:** Pago falló

### Estados de PaymentSession:
- **CREATED:** Sesión creada en Stripe
- **COMPLETED:** Sesión completada (pago exitoso)
- **EXPIRED:** Sesión expirada sin pago

---

## 🔐 Seguridad y Autenticación

### Headers de Autenticación:
```
Authorization: Bearer {jwt_token}
```

### Permisos por Rol:

#### 🎓 STUDENT
- ✅ Crear sesiones de pago para cursos
- ✅ Ver sus propios pagos y sesiones
- ❌ Ver pagos de otros usuarios
- ❌ Acceso a endpoints administrativos

#### 👨‍🏫 INSTRUCTOR  
- ✅ Ver pagos de sus cursos
- ✅ Ver sesiones de pago de sus cursos
- ❌ Crear pagos manualmente
- ❌ Ver información de otros instructores

#### 👨‍💼 ADMIN
- ✅ Acceso completo a todos los endpoints
- ✅ Crear pagos manualmente
- ✅ Ver estadísticas y reportes
- ✅ Gestionar reembolsos

---

## 🚀 Implementación Frontend

### Ejemplo de Flujo Completo:

#### 1. Crear sesión de pago:
```javascript
const createPaymentSession = async (courseId, userId) => {
  try {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`
      },
      body: JSON.stringify({
        courseId: courseId,
        userId: userId,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      })
    });
    
    const data = await response.json();
    
    if (data.checkoutUrl) {
      // Redirigir a Stripe Checkout
      window.location.href = data.checkoutUrl;
    }
  } catch (error) {
    console.error('Error creating payment session:', error);
  }
};
```

#### 2. Verificar estado de pago:
```javascript
const checkPaymentStatus = async (userId) => {
  try {
    const response = await fetch(`/api/payments/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${jwt_token}`
      }
    });
    
    const payments = await response.json();
    return payments.filter(payment => payment.status === 'COMPLETED');
  } catch (error) {
    console.error('Error checking payment status:', error);
  }
};
```

#### 3. Obtener historial de pagos:
```javascript
const getUserPaymentHistory = async (userId) => {
  try {
    const response = await fetch(`/api/payments/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${jwt_token}`
      }
    });
    
    const payments = await response.json();
    
    // Ordenar por fecha descendente
    return payments.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error('Error fetching payment history:', error);
  }
};
```

---

## ⚠️ Consideraciones Importantes

### Variables de Entorno Requeridas:
```env
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### URLs de Redirección:
- **Success URL:** Página de confirmación después del pago exitoso
- **Cancel URL:** Página cuando el usuario cancela el pago
- **Webhook URL:** `https://tu-dominio.com/api/stripe/webhook`

### Testing:
- Usar las tarjetas de prueba de Stripe: `4242 4242 4242 4242`
- Las claves deben empezar con `sk_test_` en desarrollo
- Configurar webhooks en el dashboard de Stripe

### Producción:
- Cambiar a claves de producción: `sk_live_`
- Configurar HTTPS obligatorio
- Implementar rate limiting
- Configurar logging de transacciones
- Backup de base de datos antes de procesar reembolsos

---

## 📞 Soporte

Para dudas sobre la implementación:
- 📧 Email: dev-team@elearning-platform.com
- 📚 Documentación Stripe: https://stripe.com/docs/api
- 🔧 Testing: Usar `stripe_checkout_test.sh` para pruebas automatizadas