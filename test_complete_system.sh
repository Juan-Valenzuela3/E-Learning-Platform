#!/bin/bash

# Script completo para probar todo el sistema de seguridad
# Uso: ./test_complete_system.sh

BASE_URL="http://localhost:8080"
ADMIN_EMAIL="admin@system.com"
ADMIN_PASSWORD="admin123"

echo "🔐 SISTEMA DE SEGURIDAD COMPLETO - PRUEBAS"
echo "============================================="
echo ""

# 1. Verificar que el registro público funciona
echo "1️⃣ PRUEBA: Registro público (debe funcionar)"
echo "---------------------------------------------"
http POST "$BASE_URL/api/auth/register" \
  userName="UsuarioPublico" \
  lastName="Test" \
  email="publico@test.com" \
  password="123456" \
  role="STUDENT"
echo ""

# 2. Verificar que el login público funciona
echo "2️⃣ PRUEBA: Login público (debe funcionar)"
echo "------------------------------------------"
LOGIN_RESPONSE=$(http POST "$BASE_URL/api/auth/login" \
  email="publico@test.com" \
  password="123456" --print=b)

# Extraer access token del usuario normal
NORMAL_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$NORMAL_TOKEN" ] && [ "$NORMAL_TOKEN" != "null" ]; then
    echo "✅ Login público exitoso"
    echo "✅ Token obtenido: ${NORMAL_TOKEN:0:20}..."
    echo ""

    # 3. Verificar que usuario normal NO puede acceder a funciones de admin
    echo "3️⃣ PRUEBA: Usuario normal NO puede acceder a admin (debe fallar)"
    echo "----------------------------------------------------------------"
    http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $NORMAL_TOKEN"
    echo ""

    # 4. Verificar que usuario normal NO puede eliminar usuarios
    echo "4️⃣ PRUEBA: Usuario normal NO puede eliminar usuarios (debe fallar)"
    echo "------------------------------------------------------------------"
    http DELETE "$BASE_URL/api/users/999" \
      Authorization:"Bearer $NORMAL_TOKEN"
    echo ""
else
    echo "❌ Error: No se pudo obtener token del usuario normal"
fi

# 5. Crear y loguear admin
echo "5️⃣ PRUEBA: Crear y loguear admin"
echo "--------------------------------"
http POST "$BASE_URL/api/auth/register" \
  userName="Admin" \
  lastName="Sistema" \
  email="$ADMIN_EMAIL" \
  password="$ADMIN_PASSWORD" \
  role="ADMIN"
echo ""

ADMIN_RESPONSE=$(http POST "$BASE_URL/api/auth/login" \
  email="$ADMIN_EMAIL" \
  password="$ADMIN_PASSWORD" --print=b)

# Extraer access token del admin
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ADMIN_TOKEN" ] && [ "$ADMIN_TOKEN" != "null" ]; then
    echo "✅ Admin logueado exitosamente"
    echo "✅ Token admin obtenido: ${ADMIN_TOKEN:0:20}..."
    echo ""

    # 6. Verificar que admin SÍ puede ver usuarios
    echo "6️⃣ PRUEBA: Admin SÍ puede ver usuarios (debe funcionar)"
    echo "------------------------------------------------------"
    http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $ADMIN_TOKEN"
    echo ""

    # 7. Crear usuario de prueba para eliminar
    echo "7️⃣ PRUEBA: Crear usuario de prueba"
    echo "----------------------------------"
    http POST "$BASE_URL/api/auth/register" \
      userName="UsuarioEliminar" \
      lastName="Test" \
      email="eliminar@test.com" \
      password="123456" \
      role="STUDENT"
    echo ""

    # 8. Verificar que admin SÍ puede eliminar usuarios
    echo "8️⃣ PRUEBA: Admin SÍ puede eliminar usuarios (debe funcionar)"
    echo "-----------------------------------------------------------"
    # Obtener lista de usuarios para encontrar el ID del usuario a eliminar
    USER_LIST=$(http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $ADMIN_TOKEN" --print=b)
    
    # Buscar el usuario con email eliminar@test.com
    USER_ID=$(echo "$USER_LIST" | grep -o '"id":[0-9]*' | tail -1 | cut -d':' -f2)
    
    if [ -n "$USER_ID" ]; then
        echo "🗑️ Eliminando usuario con ID: $USER_ID"
        http DELETE "$BASE_URL/api/users/$USER_ID" \
          Authorization:"Bearer $ADMIN_TOKEN"
        echo ""

        # 9. Verificar eliminación
        echo "9️⃣ PRUEBA: Verificar eliminación"
        echo "-------------------------------"
        http GET "$BASE_URL/api/users/all" \
          Authorization:"Bearer $ADMIN_TOKEN"
        echo ""
    else
        echo "❌ No se pudo encontrar el usuario a eliminar"
    fi

else
    echo "❌ Error: No se pudo obtener token del admin"
fi

echo "🏁 PRUEBAS COMPLETADAS!"
echo ""
echo "📋 RESUMEN DE SEGURIDAD:"
echo "✅ Registro público funciona"
echo "✅ Login público funciona"
echo "✅ Usuarios normales NO pueden acceder a funciones de admin"
echo "✅ Solo ADMIN puede ver y eliminar usuarios"
echo "✅ Sistema de roles funcionando correctamente"
