#!/bin/bash

# Test básico para E-Learning Platform Backend
# Requiere: curl, jq


API_URL="http://149.130.176.157:8080"
EMAIL="user@example.com"
PASSWORD="password123"
REGISTER_EMAIL="juan.perez@example.com"
REGISTER_USER="Juan"
REGISTER_LASTNAME="Pérez"
REGISTER_PASSWORD="password123"
REGISTER_ROLE="STUDENT"


echo "\n--- Test: Registro de usuario ---"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/users/register" \
	-H "Content-Type: application/json" \
	-d "{\"userName\": \"$REGISTER_USER\", \"lastName\": \"$REGISTER_LASTNAME\", \"email\": \"$REGISTER_EMAIL\", \"password\": \"$REGISTER_PASSWORD\", \"role\": \"$REGISTER_ROLE\"}")
echo "$REGISTER_RESPONSE"

echo "\n--- Test: Login de usuario ---"
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
	-H "Content-Type: application/json" \
	-d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")
echo "$LOGIN_RESPONSE"

# Extraer token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
	echo "Error: No se pudo obtener el token."
	exit 1
fi

echo "\n--- Test: Validación de token ---"
VALIDATE_RESPONSE=$(curl -s -X GET "$API_URL/auth/validate?token=$TOKEN" \
	-H "Content-Type: application/json")
echo "$VALIDATE_RESPONSE"

echo "\n--- Test: Obtener perfil de usuario autenticado ---"
PROFILE_RESPONSE=$(curl -s -X GET "$API_URL/api/users/profile" \
	-H "Authorization: Bearer $TOKEN" \
	-H "Content-Type: application/json")
echo "$PROFILE_RESPONSE"

echo "\n--- Test: Obtener catálogo público de cursos ---"
COURSES_RESPONSE=$(curl -s -X GET "$API_URL/api/courses" \
	-H "Content-Type: application/json")
echo "$COURSES_RESPONSE"

# Obtener el id del primer curso si existe
COURSE_ID=$(echo "$COURSES_RESPONSE" | jq -r '.[0].id')
if [ "$COURSE_ID" != "null" ] && [ -n "$COURSE_ID" ]; then
	echo "\n--- Test: Obtener detalle de curso (ID: $COURSE_ID) ---"
	COURSE_DETAIL=$(curl -s -X GET "$API_URL/api/courses/$COURSE_ID" \
		-H "Content-Type: application/json")
	echo "$COURSE_DETAIL"
else
	echo "\nNo hay cursos disponibles para mostrar detalle."
fi

echo "\n--- Fin de pruebas ---"


curl -X POST http://149.130.176.157:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.peres@example.com",
    "password": "password123"
  }'

Token: eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbeyJhdXRob3JpdHkiOiJST0xFX1NUVURFTlQifV0sInN1YiI6Imp1YW4ucGVyZXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTcxMDk1OTksImV4cCI6MTc1NzE5NTk5OX0.bfn8bSYRjfsSTUyW45w1J23E229K6mGBNAt5Iaf-9NE


curl -X PUT http://149.130.176.157:8080/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbeyJhdXRob3JpdHkiOiJST0xFX1NUVURFTlQifV0sInN1YiI6Imp1YW4ucGVyZXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTcxMDk1OTksImV4cCI6MTc1NzE5NTk5OX0.bfn8bSYRjfsSTUyW45w1J23E229K6mGBNAt5Iaf-9NE" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Juan Carlos",
    "lastName": "Pérez González",
    "email": "juan.carlos.perez@example.com",
    "profileImageUrl": "https://example.com/profile-images/user_123.jpg"
  }'

  curl -X GET http://149.130.176.157:8080/api/users/all \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjpbeyJhdXRob3JpdHkiOiJST0xFX1NUVURFTlQifV0sInN1YiI6Imp1YW4ucGVyZXNAZXhhbXBsZS5jb20iLCJpYXQiOjE3NTcxMDk1OTksImV4cCI6MTc1NzE5NTk5OX0.bfn8bSYRjfsSTUyW45w1J23E229K6mGBNAt5Iaf-9NE" \
  -H "Content-Type: application/json"