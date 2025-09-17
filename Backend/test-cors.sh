#!/bin/bash

echo "🔍 Probando configuración CORS del backend..."
echo ""

# URL del backend
BACKEND_URL="http://149.130.176.157:8080"

echo "1. Probando OPTIONS (preflight request)..."
curl -i -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  "${BACKEND_URL}/api/users/register"

echo ""
echo "----------------------------------------"
echo ""

echo "2. Probando POST directo con CORS headers..."
curl -i -X POST \
  -H "Origin: http://localhost:5173" \
  -H "Content-Type: application/json" \
  -d '{"userName":"test","lastName":"user","email":"test@test.com","password":"Test123456","role":"STUDENT"}' \
  "${BACKEND_URL}/api/users/register"

echo ""
echo "----------------------------------------"
echo ""

echo "3. Probando endpoint de salud..."
curl -i -X GET \
  -H "Origin: http://localhost:5173" \
  "${BACKEND_URL}/actuator/health"

echo ""
echo "✅ Pruebas completadas. Busca los headers 'Access-Control-Allow-*' en las respuestas."