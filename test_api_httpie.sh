#!/bin/bash

# Script para probar la API de E-Learning Platform usando HTTPie
# Uso: ./test_api_httpie.sh

BASE_URL="http://localhost:8080"
EMAIL="httpie@test.com"
PASSWORD="test123"

echo "🚀 Iniciando pruebas de la API E-Learning Platform con HTTPie"
echo "=============================================================="

# 1. Probar endpoint público
echo "1️⃣ Probando endpoint público..."
http GET "$BASE_URL/api/public/hello"
echo ""

# 2. Registrar usuario
echo "2️⃣ Registrando usuario..."
http POST "$BASE_URL/api/auth/register" \
  userName="TestHTTPie" \
  lastName="User" \
  email="$EMAIL" \
  password="$PASSWORD"
echo ""

# 3. Login y capturar tokens
echo "3️⃣ Haciendo login..."
RESPONSE=$(http POST "$BASE_URL/api/auth/login" \
  email="$EMAIL" \
  password="$PASSWORD" --print=b)

# Extraer tokens usando jq (si está disponible) o grep
if command -v jq &> /dev/null; then
    ACCESS_TOKEN=$(echo "$RESPONSE" | jq -r '.accessToken')
    REFRESH_TOKEN=$(echo "$RESPONSE" | jq -r '.refreshToken')
else
    ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$RESPONSE" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
fi

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "✅ Access Token obtenido: ${ACCESS_TOKEN:0:20}..."
    echo "✅ Refresh Token obtenido: ${REFRESH_TOKEN:0:20}..."
    echo ""

    # 4. Probar endpoint protegido
    echo "4️⃣ Probando endpoint protegido..."
    http GET "$BASE_URL/api/users/me" \
      Authorization:"Bearer $ACCESS_TOKEN"
    echo ""

    # 5. Renovar access token
    echo "5️⃣ Renovando access token..."
    REFRESH_RESPONSE=$(http POST "$BASE_URL/api/auth/refresh" \
      refreshToken="$REFRESH_TOKEN" --print=b)
    
    if command -v jq &> /dev/null; then
        NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.accessToken')
    else
        NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    fi
    
    if [ -n "$NEW_ACCESS_TOKEN" ] && [ "$NEW_ACCESS_TOKEN" != "null" ]; then
        echo "✅ Nuevo Access Token obtenido: ${NEW_ACCESS_TOKEN:0:20}..."
        echo ""

        # 6. Probar endpoint protegido con nuevo token
        echo "6️⃣ Probando endpoint protegido con token renovado..."
        http GET "$BASE_URL/api/users/me" \
          Authorization:"Bearer $NEW_ACCESS_TOKEN"
        echo ""

        # 7. Logout
        echo "7️⃣ Haciendo logout..."
        http POST "$BASE_URL/api/auth/logout" \
          Authorization:"Bearer $NEW_ACCESS_TOKEN" \
          refreshToken="$REFRESH_TOKEN"
        echo ""
    fi
else
    echo "❌ Error: No se pudo obtener el access token"
fi

echo "🏁 Pruebas completadas!"
