#!/bin/bash
# Test de integración Stripe: crear sesión de pago para un curso de prueba
# Requiere: backend corriendo en http://localhost:8080

set -e  # Salir si algún comando falla

# Colores para output más claro
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs con color
log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Función para verificar si el backend está corriendo
check_backend() {
    log_info "Verificando si el backend está corriendo en http://149.130.176.157:8080..."
    if ! curl -s --max-time 5 "http://149.130.176.157:8080/actuator/health" > /dev/null 2>&1; then
        log_error "Backend no está corriendo en http://149.130.176.157:8080"
        log_info "Inicia el backend con: ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev"
        exit 1
    fi
    log_success "Backend está corriendo correctamente"
}

# Función para validar respuesta JSON
validate_json() {
    local response="$1"
    local description="$2"
    
    if ! echo "$response" | jq . > /dev/null 2>&1; then
        log_error "Respuesta inválida de $description:"
        echo "$response"
        return 1
    fi
    return 0
}

# === INICIO DEL TEST ===
log_info "=== INICIO DEL TEST DE INTEGRACIÓN STRIPE ==="
check_backend

# === 1. Obtener todos los cursos públicos ===
log_info "Paso 1: Obteniendo cursos públicos..."
COURSES_RESPONSE=$(curl -s -X GET "http://149.130.176.157:8080/api/courses" \
    -H "Accept: application/json")

if ! validate_json "$COURSES_RESPONSE" "cursos"; then
    exit 1
fi

COURSE_COUNT=$(echo "$COURSES_RESPONSE" | jq length)
log_success "Se encontraron $COURSE_COUNT cursos"
echo "$COURSES_RESPONSE" | jq '.[0:3] | .[] | {id, title, price, isPremium}'

# Selecciona el primer curso disponible
COURSE_ID=$(echo "$COURSES_RESPONSE" | jq -r '.[0].id')
COURSE_TITLE=$(echo "$COURSES_RESPONSE" | jq -r '.[0].title')
COURSE_PRICE=$(echo "$COURSES_RESPONSE" | jq -r '.[0].price')

if [ -z "$COURSE_ID" ] || [ "$COURSE_ID" = "null" ]; then
    log_error "No se encontró ningún curso público"
    exit 1
fi

log_success "Curso seleccionado: ID=$COURSE_ID, Título='$COURSE_TITLE', Precio=\$$COURSE_PRICE"

# === 2. Login de usuario ===
USER_EMAIL="admin2@admin.com"
USER_PASSWORD="Password123"  # Contraseña estándar para todos los usuarios de prueba

log_info "Paso 2: Iniciando sesión para $USER_EMAIL..."
LOGIN_RESPONSE=$(curl -s -X POST "http://149.130.176.157:8080/auth/login" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "{\"email\": \"$USER_EMAIL\", \"password\": \"$USER_PASSWORD\"}")

if ! validate_json "$LOGIN_RESPONSE" "login"; then
    log_error "Error en el login. Posibles causas:"
    echo "  - Usuario no existe"
    echo "  - Contraseña incorrecta" 
    echo "  - Backend no está configurado correctamente"
    exit 1
fi

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token // empty')
USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.userId // .user.id // .id // empty')

if [ -z "$TOKEN" ]; then
    log_error "No se pudo obtener token JWT. Respuesta completa:"
    echo "$LOGIN_RESPONSE" | jq .
    log_warning "Verifica que el usuario 'juan@example.com' existe en la base de datos"
    exit 1
fi

# Debug: mostrar respuesta completa de login para ver estructura
log_info "Respuesta completa del login:"
echo "$LOGIN_RESPONSE" | jq .

log_success "Login exitoso - Usuario ID: $USER_ID"
log_info "Token JWT: ${TOKEN:0:50}..."

# === 3. Crear sesión de pago Stripe autenticada ===
log_info "Paso 3: Creando sesión de pago Stripe para el curso $COURSE_ID..."

# Verificar que USER_ID no esté vacío
if [ -z "$USER_ID" ]; then
    log_error "USER_ID está vacío. No se puede crear la sesión de pago."
    log_info "Intentando extraer USER_ID de otra forma..."
    USER_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.user.id // .data.id // .userInfo.id // empty')
    if [ -z "$USER_ID" ]; then
        log_error "No se pudo extraer USER_ID de la respuesta del login"
        exit 1
    fi
    log_info "USER_ID extraído: $USER_ID"
fi

PAYLOAD=$(jq -n \
    --arg courseId "$COURSE_ID" \
    --arg userId "$USER_ID" \
    '{courseId: ($courseId | tonumber), userId: ($userId | tonumber)}')

log_info "Payload enviado: $PAYLOAD"

STRIPE_RESPONSE=$(curl -s -X POST "http://149.130.176.157:8080/api/stripe/create-checkout-session" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "$PAYLOAD")

if ! validate_json "$STRIPE_RESPONSE" "Stripe"; then
    log_error "Error en la respuesta de Stripe"
    exit 1
fi

log_info "Respuesta completa de Stripe:"
echo "$STRIPE_RESPONSE" | jq .

# Verificar si hay errores en la respuesta (solo errores reales, no mensajes de éxito)
ERROR_MESSAGE=$(echo "$STRIPE_RESPONSE" | jq -r '.error // empty')
if [ -n "$ERROR_MESSAGE" ]; then
    log_error "Error del backend: $ERROR_MESSAGE"
    exit 1
fi

# Extraer URL de checkout
CHECKOUT_URL=$(echo "$STRIPE_RESPONSE" | jq -r '.checkoutUrl // .url // empty')
SESSION_ID=$(echo "$STRIPE_RESPONSE" | jq -r '.sessionId // empty')

if [ -n "$CHECKOUT_URL" ] && [ -n "$SESSION_ID" ]; then
    log_success "¡Sesión de Stripe creada exitosamente!"
    echo ""
    echo "📋 RESUMEN DEL TEST:"
    echo "   Curso: $COURSE_TITLE (\$$COURSE_PRICE)"
    echo "   Usuario: $USER_EMAIL (ID: $USER_ID)"
    echo "   Session ID: $SESSION_ID"
    echo ""
    echo "🌐 URL DE PAGO:"
    echo "   $CHECKOUT_URL"
    echo ""
    log_info "Abre esta URL en tu navegador para completar el pago de prueba"
    
    # === TEST EXITOSO ===
    echo ""
    log_success "=== TEST DE INTEGRACIÓN STRIPE COMPLETADO EXITOSAMENTE ==="
    echo ""
    echo "✅ Todos los componentes funcionan correctamente:"
    echo "   • Backend corriendo en localhost:8080"
    echo "   • Autenticación JWT funcionando"
    echo "   • API de cursos funcionando"
    echo "   • Integración con Stripe funcionando"
    echo "   • Sesión de pago creada exitosamente"
    echo ""
    log_warning "Usa los números de tarjeta de prueba de Stripe:"
    echo "   • Pago exitoso: 4242 4242 4242 4242 (cualquier CVV y fecha futura)"
    echo "   • Pago rechazado: 4000 0000 0000 0002"
    echo "   • Requiere autenticación 3D: 4000 0025 0000 3155"
    echo ""
    exit 0
else
    log_error "No se pudo crear la sesión de Stripe"
    log_error "URL de checkout: '$CHECKOUT_URL'"
    log_error "Session ID: '$SESSION_ID'"
    log_info "Revisa los logs del backend para más detalles"
    exit 1
fi

log_success "=== TEST COMPLETADO EXITOSAMENTE ==="
