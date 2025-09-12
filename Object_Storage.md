# Object Storage API

## Subir Imagen de Perfil

**Endpoint:** `POST /api/users/profile/upload-image`

**Autenticación:** JWT Token requerido (Header: `Authorization: Bearer <token>`)

### Datos requeridos:
- `file`: Archivo de imagen (JPG, JPEG, PNG, máx. 5MB)

### Ejemplo con cURL:

```bash
# 1. Obtener token (endpoint correcto)
curl -X POST http://IP_DEL_SERVIDOR:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"password123"}'

# 2. Subir imagen (endpoint correcto)
curl -X POST http://IP_DEL_SERVIDOR:8080/api/users/profile/upload-image \
  -H "Authorization: Bearer TU_JWT_TOKEN_AQUI" \
  -F "file=@ruta/a/tu/imagen.jpg"
```

### Respuesta exitosa (200):
```json
{
  "id": 1,
  "userName": "Juan",
  "lastName": "Pérez", 
  "email": "juan.perez@example.com",
  "role": "STUDENT",
  "profileImageUrl": "https://objectstorage.sa-bogota-1.oraclecloud.com/n/axxillutcfyk/b/bucket-images/o/profile-images/user_1_a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "active": true
}
```

### Posibles respuestas de error:

#### Error de validación de archivo (400):
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Tipo de archivo no permitido. Extensiones válidas: [jpg, jpeg, png]",
  "timestamp": "2025-09-11T21:45:00.000+00:00",
  "path": "/api/users/profile/upload-image"
}
```

#### Error de tamaño de archivo (400):
```json
{
  "error": "VALIDATION_ERROR", 
  "message": "El archivo excede el tamaño máximo permitido (5 MB)",
  "timestamp": "2025-09-11T21:45:00.000+00:00",
  "path": "/api/users/profile/upload-image"
}
```

#### Error de autenticación (401):
```json
{
  "error": "UNAUTHORIZED",
  "message": "Token JWT inválido o expirado",
  "timestamp": "2025-09-11T21:45:00.000+00:00",
  "path": "/api/users/profile/upload-image"
}
```

#### Error de servicio (500):
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Servicio de almacenamiento no disponible. Contactar al administrador.",
  "timestamp": "2025-09-11T21:45:00.000+00:00",
  "path": "/api/users/profile/upload-image"
}
```

## Ejemplo Completo de Uso

### Script de prueba funcional:
```bash
#!/bin/bash

# Configuración
API_URL="http://149.130.176.157:8080"
EMAIL="usuario@example.com"
PASSWORD="password123"
IMAGE_PATH="/ruta/a/tu/imagen.jpg"

# 1. Login y obtener token
echo "Obteniendo token de autenticación..."
LOGIN_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"'$EMAIL'","password":"'$PASSWORD'"}')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ]; then
    echo "❌ Error: No se pudo obtener el token"
    exit 1
fi

echo "✅ Token obtenido: ${TOKEN:0:30}..."

# 2. Subir imagen
echo "Subiendo imagen de perfil..."
UPLOAD_RESPONSE=$(curl -s -X POST $API_URL/api/users/profile/upload-image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$IMAGE_PATH")

echo "Respuesta: $UPLOAD_RESPONSE"

# 3. Verificar URL generada
IMAGE_URL=$(echo $UPLOAD_RESPONSE | jq -r '.profileImageUrl')
if [ "$IMAGE_URL" != "null" ]; then
    echo "✅ Imagen subida exitosamente: $IMAGE_URL"
    
    # Verificar acceso público
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
    echo "Estado de acceso público: HTTP $HTTP_STATUS"
else
    echo "❌ Error en la subida de imagen"
fi
```

## Notas Importantes

### Configuración de Desarrollo vs Producción:
- **Desarrollo**: URLs simuladas para tests
- **Producción**: OCI Object Storage real con URLs públicas

### Seguridad:
- Token JWT requerido en header `Authorization`
- Validación de tipos de archivo (solo JPG, JPEG, PNG)
- Límite de tamaño: 5MB por archivo
- Validación de extensiones y MIME types

### URLs Generadas:
- Formato: `https://objectstorage.sa-bogota-1.oraclecloud.com/n/{namespace}/b/{bucket}/o/{object-path}`
- Acceso público configurado en OCI Object Storage
- URLs permanentes hasta eliminación manual