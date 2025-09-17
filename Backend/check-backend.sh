#!/bin/bash

# Script para verificar el estado del backend después del despliegue
# Uso: ./check-backend.sh [URL_BACKEND]

BACKEND_URL=${1:-"http://localhost:8080"}

echo "🔍 Verificando estado del backend en: $BACKEND_URL"
echo "================================================"

# Test 1: Health check básico
echo "1. Verificando que el servidor esté activo..."
if curl -s -f "$BACKEND_URL/actuator/health" > /dev/null 2>&1; then
    echo "   ✅ Servidor activo"
else
    echo "   ⚠️  Intentando endpoint básico..."
    if curl -s -f "$BACKEND_URL/api/courses" > /dev/null 2>&1; then
        echo "   ✅ Servidor activo (endpoint cursos)"
    else
        echo "   ❌ Servidor no responde"
        exit 1
    fi
fi

# Test 2: Verificar endpoint de cursos públicos
echo "2. Verificando endpoint de cursos públicos..."
COURSES_RESPONSE=$(curl -s "$BACKEND_URL/api/courses")
COURSES_COUNT=$(echo "$COURSES_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

echo "   📊 Total de cursos en respuesta: $COURSES_COUNT"

if [ "$COURSES_COUNT" -gt 100000 ]; then
    echo "   ⚠️  ADVERTENCIA: Demasiados cursos ($COURSES_COUNT). Posible problema de datos."
elif [ "$COURSES_COUNT" -gt 0 ]; then
    echo "   ✅ Cantidad normal de cursos"
else
    echo "   ℹ️  Base de datos limpia (sin cursos)"
fi

# Test 3: Verificar endpoint de categorías
echo "3. Verificando endpoint de categorías..."
CATEGORIES_RESPONSE=$(curl -s "$BACKEND_URL/api/categories")
CATEGORIES_COUNT=$(echo "$CATEGORIES_RESPONSE" | jq '. | length' 2>/dev/null || echo "0")

echo "   📊 Total de categorías: $CATEGORIES_COUNT"

if [ "$CATEGORIES_COUNT" -gt 0 ]; then
    echo "   ✅ Categorías inicializadas correctamente"
else
    echo "   ⚠️  No hay categorías (puede ser normal en DB limpia)"
fi

# Test 4: Verificar CORS
echo "4. Verificando configuración CORS..."
CORS_HEADERS=$(curl -s -I -X OPTIONS \
    -H "Origin: http://localhost:5173" \
    -H "Access-Control-Request-Method: GET" \
    "$BACKEND_URL/api/courses" | grep -i "access-control")

if [ -n "$CORS_HEADERS" ]; then
    echo "   ✅ CORS configurado"
    echo "   📋 Headers CORS encontrados:"
    echo "$CORS_HEADERS" | sed 's/^/      /'
else
    echo "   ⚠️  CORS no detectado"
fi

echo ""
echo "🎯 Resumen del chequeo:"
echo "   - Servidor: $([ $? -eq 0 ] && echo "✅ Activo" || echo "❌ Inactivo")"
echo "   - Cursos: $COURSES_COUNT"
echo "   - Categorías: $CATEGORIES_COUNT"
echo "   - CORS: $([ -n "$CORS_HEADERS" ] && echo "✅ OK" || echo "⚠️  Revisar")"

if [ "$COURSES_COUNT" -lt 1000 ]; then
    echo ""
    echo "✅ El backend parece estar funcionando correctamente con una cantidad normal de datos."
else
    echo ""
    echo "⚠️  RECOMENDACIÓN: Revisar la base de datos, hay demasiados cursos."
fi