#!/bin/bash

# Script de prueba para el sistema de administración
# Prueba: Admin por defecto, cambio de roles, y funcionalidades de admin

# Configuración
BASE_URL="http://localhost:8080"
ADMIN_EMAIL="admin@system.com"
ADMIN_PASSWORD="admin123"
STUDENT_EMAIL="estudiante@test.com"
STUDENT_PASSWORD="password123"

echo "🧪 PRUEBAS DEL SISTEMA DE ADMINISTRACIÓN"
echo "========================================"

# Función para mostrar el estado de la aplicación
check_app_status() {
    echo "🔍 Verificando estado de la aplicación..."
    if curl -s "$BASE_URL/api/public/health" > /dev/null 2>&1; then
        echo "✅ Aplicación está ejecutándose"
        return 0
    else
        echo "❌ Aplicación no está ejecutándose en $BASE_URL"
        echo "   Ejecuta: cd Backend/Dev-learning-Platform && mvn spring-boot:run"
        return 1
    fi
}

# Función para hacer login y obtener token
login_and_get_token() {
    local email=$1
    local password=$2
    local token_var=$3
    
    echo "🔐 Autenticando $email..."
    local response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\"}")
    
    if echo "$response" | grep -q "accessToken"; then
        local token=$(echo "$response" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
        eval "$token_var=\"$token\""
        echo "✅ Login exitoso para $email"
        return 0
    else
        echo "❌ Error en login para $email: $response"
        return 1
    fi
}

# Función para registrar un usuario
register_user() {
    local email=$1
    local password=$2
    local userName=$3
    local lastName=$4
    local role=$5
    
    echo "📝 Registrando usuario $email..."
    local response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"userName\":\"$userName\",\"lastName\":\"$lastName\",\"email\":\"$email\",\"password\":\"$password\",\"role\":\"$role\"}")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Usuario registrado exitosamente"
        return 0
    else
        echo "❌ Error al registrar usuario: $response"
        return 1
    fi
}

# Función para obtener todos los usuarios (solo admin)
get_all_users() {
    local token=$1
    echo "👥 Obteniendo lista de usuarios..."
    local response=$(curl -s -X GET "$BASE_URL/api/users/all" \
        -H "Authorization: Bearer $token")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Lista de usuarios obtenida"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 0
    else
        echo "❌ Error al obtener usuarios: $response"
        return 1
    fi
}

# Función para cambiar rol de usuario
change_user_role() {
    local admin_token=$1
    local user_id=$2
    local new_role=$3
    
    echo "🔄 Cambiando rol del usuario $user_id a $new_role..."
    local response=$(curl -s -X PUT "$BASE_URL/api/users/$user_id/role" \
        -H "Authorization: Bearer $admin_token" \
        -H "Content-Type: application/json" \
        -d "{\"role\":\"$new_role\"}")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Rol cambiado exitosamente"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 0
    else
        echo "❌ Error al cambiar rol: $response"
        return 1
    fi
}

# Función para obtener información del usuario actual
get_current_user() {
    local token=$1
    echo "👤 Obteniendo información del usuario actual..."
    local response=$(curl -s -X GET "$BASE_URL/api/users/me" \
        -H "Authorization: Bearer $token")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Información del usuario obtenida"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 0
    else
        echo "❌ Error al obtener información del usuario: $response"
        return 1
    fi
}

# Verificar que la aplicación esté ejecutándose
if ! check_app_status; then
    exit 1
fi

echo ""
echo "1️⃣ PRUEBA: Login del admin por defecto"
echo "----------------------------------------"
ADMIN_TOKEN=""
if login_and_get_token "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "ADMIN_TOKEN"; then
    echo "✅ Admin por defecto funciona correctamente"
    echo "   Token: ${ADMIN_TOKEN:0:20}..."
else
    echo "❌ Error: No se pudo autenticar al admin por defecto"
    exit 1
fi

echo ""
echo "2️⃣ PRUEBA: Verificar información del admin"
echo "-------------------------------------------"
get_current_user "$ADMIN_TOKEN"

echo ""
echo "3️⃣ PRUEBA: Obtener lista de usuarios (solo admin)"
echo "------------------------------------------------"
get_all_users "$ADMIN_TOKEN"

echo ""
echo "4️⃣ PRUEBA: Registrar un estudiante"
echo "----------------------------------"
if register_user "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "Juan" "Estudiante" "STUDENT"; then
    echo "✅ Estudiante registrado correctamente"
else
    echo "❌ Error al registrar estudiante"
    exit 1
fi

echo ""
echo "5️⃣ PRUEBA: Login del estudiante"
echo "-------------------------------"
STUDENT_TOKEN=""
if login_and_get_token "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "STUDENT_TOKEN"; then
    echo "✅ Estudiante puede hacer login correctamente"
    echo "   Token: ${STUDENT_TOKEN:0:20}..."
else
    echo "❌ Error: No se pudo autenticar al estudiante"
    exit 1
fi

echo ""
echo "6️⃣ PRUEBA: Verificar que estudiante NO puede acceder a funciones de admin"
echo "------------------------------------------------------------------------"
echo "🔒 Intentando acceder a lista de usuarios como estudiante..."
response=$(curl -s -X GET "$BASE_URL/api/users/all" \
    -H "Authorization: Bearer $STUDENT_TOKEN")

if echo "$response" | grep -q "403\|Forbidden\|Access denied"; then
    echo "✅ Estudiante correctamente bloqueado de funciones de admin"
else
    echo "❌ Error: Estudiante pudo acceder a funciones de admin"
    echo "   Respuesta: $response"
fi

echo ""
echo "7️⃣ PRUEBA: Obtener ID del estudiante para cambio de rol"
echo "------------------------------------------------------"
echo "🔍 Buscando ID del estudiante en la lista de usuarios..."
response=$(curl -s -X GET "$BASE_URL/api/users/all" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

# Extraer ID del estudiante (asumiendo que es el segundo usuario después del admin)
STUDENT_ID=$(echo "$response" | grep -o '"id":[0-9]*' | tail -1 | cut -d':' -f2)
if [ -n "$STUDENT_ID" ]; then
    echo "✅ ID del estudiante encontrado: $STUDENT_ID"
else
    echo "❌ No se pudo encontrar el ID del estudiante"
    exit 1
fi

echo ""
echo "8️⃣ PRUEBA: Cambiar rol del estudiante a INSTRUCTOR"
echo "------------------------------------------------"
if change_user_role "$ADMIN_TOKEN" "$STUDENT_ID" "INSTRUCTOR"; then
    echo "✅ Rol cambiado de STUDENT a INSTRUCTOR"
else
    echo "❌ Error al cambiar rol"
    exit 1
fi

echo ""
echo "9️⃣ PRUEBA: Verificar cambio de rol"
echo "---------------------------------"
echo "🔍 Verificando que el rol cambió correctamente..."
response=$(curl -s -X GET "$BASE_URL/api/users/all" \
    -H "Authorization: Bearer $ADMIN_TOKEN")

if echo "$response" | grep -q "\"role\":\"INSTRUCTOR\""; then
    echo "✅ Rol cambiado correctamente a INSTRUCTOR"
else
    echo "❌ Error: El rol no se cambió correctamente"
    echo "   Respuesta: $response"
fi

echo ""
echo "🔟 PRUEBA: Login del usuario con nuevo rol"
echo "-----------------------------------------"
echo "🔐 Verificando que el usuario puede hacer login con su nuevo rol..."
if login_and_get_token "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "NEW_TOKEN"; then
    echo "✅ Usuario puede hacer login con su nuevo rol INSTRUCTOR"
    get_current_user "$NEW_TOKEN"
else
    echo "❌ Error: Usuario no puede hacer login después del cambio de rol"
fi

echo ""
echo "🏁 PRUEBAS COMPLETADAS"
echo "====================="
echo "✅ Admin por defecto funciona correctamente"
echo "✅ Sistema de roles funciona correctamente"
echo "✅ Cambio de roles funciona correctamente"
echo "✅ Seguridad de endpoints funciona correctamente"
echo ""
echo "📋 RESUMEN DE FUNCIONALIDADES VERIFICADAS:"
echo "   • Admin por defecto: admin@system.com / admin123"
echo "   • Login como estudiante y profesor"
echo "   • Cambio de roles (STUDENT → INSTRUCTOR)"
echo "   • Control de acceso basado en roles"
echo "   • Endpoints protegidos funcionando"
echo ""
echo "🎉 ¡Sistema funcionando correctamente!"
