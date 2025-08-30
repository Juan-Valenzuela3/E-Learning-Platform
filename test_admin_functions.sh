#!/bin/bash

# Script para probar las funcionalidades del Admin
# Uso: ./test_admin_functions.sh

BASE_URL="http://localhost:8080"
ADMIN_EMAIL="admin@system.com"
ADMIN_PASSWORD="admin123"

echo "👑 Iniciando pruebas de funcionalidades de Admin"
echo "=================================================="

# 1. Login del admin
echo "1️⃣ Login del Admin..."
RESPONSE=$(http POST "$BASE_URL/api/auth/login" \
  email="$ADMIN_EMAIL" \
  password="$ADMIN_PASSWORD" --print=b)

# Extraer access token
ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "✅ Admin logueado exitosamente"
    echo "✅ Access Token obtenido: ${ACCESS_TOKEN:0:20}..."
    echo ""

    # 2. Ver lista de usuarios
    echo "2️⃣ Ver lista de usuarios..."
    http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $ACCESS_TOKEN"
    echo ""

    # 3. Crear usuario de prueba
    echo "3️⃣ Crear usuario de prueba..."
    http POST "$BASE_URL/api/auth/register" \
      userName="UsuarioPrueba" \
      lastName="Eliminar" \
      email="prueba@eliminar.com" \
      password="123456" \
      role="STUDENT"
    echo ""

    # 4. Ver lista actualizada
    echo "4️⃣ Ver lista actualizada..."
    http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $ACCESS_TOKEN"
    echo ""

    # 5. Obtener ID del usuario de prueba (asumiendo que es el último)
    echo "5️⃣ Eliminar usuario de prueba..."
    # Buscar el usuario con email prueba@eliminar.com
    USER_LIST=$(http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $ACCESS_TOKEN" --print=b)
    
    # Extraer ID del usuario de prueba (simplificado)
    USER_ID=$(echo "$USER_LIST" | grep -o '"id":[0-9]*' | tail -1 | cut -d':' -f2)
    
    if [ -n "$USER_ID" ]; then
        echo "🗑️ Eliminando usuario con ID: $USER_ID"
        http DELETE "$BASE_URL/api/users/$USER_ID" \
          Authorization:"Bearer $ACCESS_TOKEN"
        echo ""

        # 6. Verificar eliminación
        echo "6️⃣ Verificar eliminación..."
        http GET "$BASE_URL/api/users/all" \
          Authorization:"Bearer $ACCESS_TOKEN"
        echo ""
    else
        echo "❌ No se pudo encontrar el usuario de prueba"
    fi

    # 7. Probar eliminar admin (debería fallar)
    echo "7️⃣ Probar eliminar admin (debería fallar)..."
    http DELETE "$BASE_URL/api/users/1" \
      Authorization:"Bearer $ACCESS_TOKEN"
    echo ""

else
    echo "❌ Error: No se pudo obtener el access token del admin"
fi

echo "🏁 Pruebas de admin completadas!"
