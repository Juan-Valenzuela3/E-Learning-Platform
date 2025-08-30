#!/bin/bash

# Script para probar la API de E-Learning Platform
# Uso: ./test_api.sh

BASE_URL="http://localhost:8080"
EMAIL="test@example.com"
PASSWORD="password123"

echo "🚀 Iniciando pruebas de la API E-Learning Platform"
echo "=================================================="

# Función para mostrar respuestas de forma legible
show_response() {
    echo "📋 Respuesta:"
    echo "$1" | jq '.' 2>/dev/null || echo "$1"
    echo ""
}

# 1. Probar endpoint público
echo "1️⃣ Probando endpoint público..."
RESPONSE=$(curl -s -X GET "$BASE_URL/api/public/hello")
show_response "$RESPONSE"

# 2. Registrar usuario
echo "2️⃣ Registrando usuario..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
    -H "Content-Type: application/json" \
    -d "{
        \"userName\": \"Test\",
        \"lastName\": \"User\",
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
    }")
show_response "$RESPONSE"

# 3. Login y capturar tokens
echo "3️⃣ Haciendo login..."
RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\"
    }")
show_response "$RESPONSE"

# Extraer tokens de la respuesta
ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
REFRESH_TOKEN=$(echo "$RESPONSE" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ]; then
    echo "✅ Access Token obtenido: ${ACCESS_TOKEN:0:20}..."
    echo "✅ Refresh Token obtenido: ${REFRESH_TOKEN:0:20}..."
    echo ""

    # 4. Probar endpoint protegido
    echo "4️⃣ Probando endpoint protegido..."
    RESPONSE=$(curl -s -X GET "$BASE_URL/api/users/me" \
        -H "Authorization: Bearer $ACCESS_TOKEN")
    show_response "$RESPONSE"

    # 5. Renovar access token
    echo "5️⃣ Renovando access token..."
    RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
        -H "Content-Type: application/json" \
        -d "{
            \"refreshToken\": \"$REFRESH_TOKEN\"
        }")
    show_response "$RESPONSE"

    # Extraer nuevo access token
    NEW_ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$NEW_ACCESS_TOKEN" ]; then
        echo "✅ Nuevo Access Token obtenido: ${NEW_ACCESS_TOKEN:0:20}..."
        echo ""

        # 6. Probar endpoint protegido con nuevo token
        echo "6️⃣ Probando endpoint protegido con token renovado..."
        RESPONSE=$(curl -s -X GET "$BASE_URL/api/users/me" \
            -H "Authorization: Bearer $NEW_ACCESS_TOKEN")
        show_response "$RESPONSE"

        # 7. Logout
        echo "7️⃣ Haciendo logout..."
        RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
            -H "Authorization: Bearer $NEW_ACCESS_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"refreshToken\": \"$REFRESH_TOKEN\"
            }")
        show_response "$RESPONSE"
    fi
else
    echo "❌ Error: No se pudo obtener el access token"
fi

echo "🏁 Pruebas completadas!"
