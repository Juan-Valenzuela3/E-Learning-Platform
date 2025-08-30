#!/bin/bash

# Script para ver la base completa de usuarios
# Uso: ./view_users.sh

BASE_URL="http://localhost:8080"
ADMIN_EMAIL="admin@system.com"
ADMIN_PASSWORD="admin123"

echo "👥 BASE COMPLETA DE USUARIOS"
echo "============================"
echo ""

# Login del admin
echo "🔐 Autenticando admin..."
RESPONSE=$(http POST "$BASE_URL/api/auth/login" \
  email="$ADMIN_EMAIL" \
  password="$ADMIN_PASSWORD" --print=b)

# Extraer access token
ACCESS_TOKEN=$(echo "$RESPONSE" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$ACCESS_TOKEN" ] && [ "$ACCESS_TOKEN" != "null" ]; then
    echo "✅ Admin autenticado"
    echo ""

    # Obtener lista de usuarios
    echo "📋 Lista completa de usuarios:"
    echo "-------------------------------"
    USERS_RESPONSE=$(http GET "$BASE_URL/api/users/all" \
      Authorization:"Bearer $ACCESS_TOKEN" --print=b)
    
    # Mostrar usuarios de forma organizada
    echo "$USERS_RESPONSE" | jq -r '.[] | "ID: \(.id) | Nombre: \(.userName) \(.lastName) | Email: \(.email) | Rol: \(.role) | Activo: \(.active) | Creado: \(.createdAt)"'
    
    echo ""
    echo "📊 Estadísticas:"
    echo "----------------"
    TOTAL_USERS=$(echo "$USERS_RESPONSE" | jq 'length')
    ADMIN_COUNT=$(echo "$USERS_RESPONSE" | jq '[.[] | select(.role == "ADMIN")] | length')
    INSTRUCTOR_COUNT=$(echo "$USERS_RESPONSE" | jq '[.[] | select(.role == "INSTRUCTOR")] | length')
    STUDENT_COUNT=$(echo "$USERS_RESPONSE" | jq '[.[] | select(.role == "STUDENT")] | length')
    
    echo "Total de usuarios: $TOTAL_USERS"
    echo "Administradores: $ADMIN_COUNT"
    echo "Instructores: $INSTRUCTOR_COUNT"
    echo "Estudiantes: $STUDENT_COUNT"
    
else
    echo "❌ Error: No se pudo autenticar al admin"
fi

echo ""
echo "🏁 Consulta completada!"
