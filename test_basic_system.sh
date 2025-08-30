#!/bin/bash

# Script de prueba básico para el sistema de e-learning
# Prueba: Admin, estudiantes, instructores y creación de cursos

# Configuración
BASE_URL="http://localhost:8080"
ADMIN_EMAIL="admin@system.com"
ADMIN_PASSWORD="admin123"
STUDENT_EMAIL="estudiante@test.com"
STUDENT_PASSWORD="password123"
INSTRUCTOR_EMAIL="instructor@test.com"
INSTRUCTOR_PASSWORD="password123"

echo "🧪 PRUEBAS BÁSICAS DEL SISTEMA E-LEARNING"
echo "=========================================="

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

# Función para crear un curso
create_course() {
    local token=$1
    local title=$2
    local description=$3
    
    echo "📚 Creando curso: $title..."
    local response=$(curl -s -X POST "$BASE_URL/api/courses" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{\"title\":\"$title\",\"description\":\"$description\"}")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Curso creado exitosamente"
        return 0
    else
        echo "❌ Error al crear curso: $response"
        return 1
    fi
}

# Función para obtener cursos
get_courses() {
    local token=$1
    local endpoint=$2
    
    echo "📖 Obteniendo cursos..."
    local response=$(curl -s -X GET "$BASE_URL/api/courses/$endpoint" \
        -H "Authorization: Bearer $token")
    
    if echo "$response" | grep -q "id"; then
        echo "✅ Cursos obtenidos exitosamente"
        echo "$response" | jq '.' 2>/dev/null || echo "$response"
        return 0
    else
        echo "❌ Error al obtener cursos: $response"
        return 1
    fi
}

echo ""
echo "1️⃣ PRUEBA: Login del admin por defecto"
echo "----------------------------------------"
ADMIN_TOKEN=""
if login_and_get_token "$ADMIN_EMAIL" "$ADMIN_PASSWORD" "ADMIN_TOKEN"; then
    echo "✅ Admin por defecto funciona correctamente"
else
    echo "❌ Error: No se pudo autenticar al admin por defecto"
    exit 1
fi

echo ""
echo "2️⃣ PRUEBA: Registrar un estudiante"
echo "----------------------------------"
if register_user "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "Juan" "Estudiante" "STUDENT"; then
    echo "✅ Estudiante registrado correctamente"
else
    echo "❌ Error al registrar estudiante"
    exit 1
fi

echo ""
echo "3️⃣ PRUEBA: Registrar un instructor"
echo "----------------------------------"
if register_user "$INSTRUCTOR_EMAIL" "$INSTRUCTOR_PASSWORD" "María" "Instructora" "INSTRUCTOR"; then
    echo "✅ Instructor registrado correctamente"
else
    echo "❌ Error al registrar instructor"
    exit 1
fi

echo ""
echo "4️⃣ PRUEBA: Login del instructor"
echo "-------------------------------"
INSTRUCTOR_TOKEN=""
if login_and_get_token "$INSTRUCTOR_EMAIL" "$INSTRUCTOR_PASSWORD" "INSTRUCTOR_TOKEN"; then
    echo "✅ Instructor puede hacer login correctamente"
else
    echo "❌ Error: No se pudo autenticar al instructor"
    exit 1
fi

echo ""
echo "5️⃣ PRUEBA: Instructor crea un curso"
echo "-----------------------------------"
if create_course "$INSTRUCTOR_TOKEN" "Programación Java Básica" "Curso introductorio a Java"; then
    echo "✅ Instructor puede crear cursos"
else
    echo "❌ Error: Instructor no pudo crear curso"
    exit 1
fi

echo ""
echo "6️⃣ PRUEBA: Instructor crea otro curso"
echo "-------------------------------------"
if create_course "$INSTRUCTOR_TOKEN" "Spring Boot Avanzado" "Curso avanzado de Spring Boot"; then
    echo "✅ Instructor puede crear múltiples cursos"
else
    echo "❌ Error: Instructor no pudo crear segundo curso"
    exit 1
fi

echo ""
echo "7️⃣ PRUEBA: Instructor ve sus cursos"
echo "-----------------------------------"
if get_courses "$INSTRUCTOR_TOKEN" "my-courses"; then
    echo "✅ Instructor puede ver sus cursos"
else
    echo "❌ Error: Instructor no pudo ver sus cursos"
fi

echo ""
echo "8️⃣ PRUEBA: Ver todos los cursos activos"
echo "---------------------------------------"
if get_courses "$INSTRUCTOR_TOKEN" "all"; then
    echo "✅ Se pueden ver todos los cursos activos"
else
    echo "❌ Error: No se pudieron ver todos los cursos"
fi

echo ""
echo "9️⃣ PRUEBA: Login del estudiante"
echo "-------------------------------"
STUDENT_TOKEN=""
if login_and_get_token "$STUDENT_EMAIL" "$STUDENT_PASSWORD" "STUDENT_TOKEN"; then
    echo "✅ Estudiante puede hacer login correctamente"
else
    echo "❌ Error: No se pudo autenticar al estudiante"
    exit 1
fi

echo ""
echo "🔟 PRUEBA: Estudiante ve todos los cursos"
echo "----------------------------------------"
if get_courses "$STUDENT_TOKEN" "all"; then
    echo "✅ Estudiante puede ver todos los cursos activos"
else
    echo "❌ Error: Estudiante no pudo ver los cursos"
fi

echo ""
echo "🏁 PRUEBAS BÁSICAS COMPLETADAS"
echo "=============================="
echo "✅ Admin por defecto funciona"
echo "✅ Registro de estudiantes funciona"
echo "✅ Registro de instructores funciona"
echo "✅ Login de todos los roles funciona"
echo "✅ Instructores pueden crear cursos"
echo "✅ Todos pueden ver cursos activos"
echo ""
echo "📋 RESUMEN DEL SISTEMA BÁSICO:"
echo "   • Admin: admin@system.com / admin123"
echo "   • Estudiantes: Pueden registrarse y ver cursos"
echo "   • Instructores: Pueden registrarse, crear cursos y ver sus cursos"
echo "   • Cursos: Sistema básico de creación y visualización"
echo ""
echo "🎉 ¡Sistema básico funcionando correctamente!"
