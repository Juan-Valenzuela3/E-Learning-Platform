# API Documentation - E-Learning Platform Backend

## 📋 Información General

**Base URL:** `http://localhost:8080`  
**Versión:** 1.0  
**Tipo de Autenticación:** JWT (JSON Web Tokens)  
**Content-Type:** `application/json`  

## Comando para ejecutar backend en entorno de desarrollo
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

## 🔐 Endpoints de Autenticación

### 1. Login de Usuario
**Endpoint:** `POST /auth/login`  
**Descripción:** Autentica usuario y retorna token JWT  
**Acceso:** Público  

#### Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Validaciones:
- **email:** Requerido, formato email válido, máximo 100 caracteres
- **password:** Requerido, mínimo 6 caracteres, máximo 100 caracteres

#### Response Exitoso (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "userName": "Juan",
  "email": "user@example.com",
  "role": "STUDENT",
  "isActive": true
}
```

#### Response de Error (401 Unauthorized):
```json
{
  "message": "Credenciales inválidas",
  "error": "INVALID_CREDENTIALS",
  "status": 401,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/auth/login"
}
```

#### Response de Usuario Inactivo (403 Forbidden):
```json
{
  "message": "Usuario inactivo",
  "error": "USER_INACTIVE",
  "status": 403,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/auth/login"
}
```

### 2. Validación de Token
**Endpoint:** `GET /auth/validate?token={jwt_token}`  
**Descripción:** Valida si un token JWT es válido  
**Acceso:** Público  

#### Query Parameters:
- **token** (requerido): Token JWT a validar

#### Response Token Válido (200 OK):
```json
{
  "valid": true,
  "username": "user@example.com"
}
```

#### Response Token Inválido (401 Unauthorized):
```json
{
  "valid": false,
  "message": "Token inválido o expirado"
}
```

## 👥 Endpoints de Usuarios

### 3. Registro de Usuario
**Endpoint:** `POST /api/users/register`  
**Descripción:** Registra un nuevo usuario en el sistema  
**Acceso:** Público  

#### Request Body:
```json
{
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Campos:
- **userName:** Nombre del usuario (requerido)
- **lastName:** Apellido del usuario (requerido)
- **email:** Email único (requerido, formato email)
- **password:** Contraseña (requerido, se encripta automáticamente)
- **role:** Rol del usuario - `STUDENT`, `INSTRUCTOR`, `ADMIN`

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "role": "STUDENT",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

#### Response de Error (409 Conflict):
```json
{
  "message": "El email ya está registrado en el sistema",
  "error": "EMAIL_ALREADY_EXISTS",
  "status": 409,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/api/users/register"
}
```

### 4. Obtener Usuario por ID
**Endpoint:** `GET /api/users/{id}`  
**Descripción:** Obtiene la información de un usuario específico por su ID  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID del usuario (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "role": "STUDENT",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Usuario no encontrado con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

### 5. Obtener Usuarios por Rol
**Endpoint:** `GET /api/users/role/{role}`  
**Descripción:** Obtiene todos los usuarios que tienen un rol específico  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **role:** Rol del usuario - `STUDENT`, `INSTRUCTOR`, `ADMIN` (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "userName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "userName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 6. Obtener Todos los Usuarios
**Endpoint:** `GET /api/users/all`  
**Descripción:** Obtiene la lista completa de todos los usuarios del sistema  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "userName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "role": "STUDENT",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "userName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "role": "INSTRUCTOR",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 3,
    "userName": "Carlos",
    "lastName": "López",
    "email": "carlos.lopez@example.com",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 7. Obtener Perfil de Usuario
**Endpoint:** `GET /api/users/profile`  
**Descripción:** Obtiene el perfil del usuario autenticado  
**Historia de Usuario:** "Como usuario quiero ver mi perfil"  
**Acceso:** STUDENT, INSTRUCTOR, ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "userName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "role": "STUDENT",
  "isActive": true,
  "profileImageUrl": null,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

#### Response de Error (401 Unauthorized):
```json
{
  "message": "Token ausente, inválido o expirado",
  "status": 401,
  "timestamp": "2025-01-01T10:00:00"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Usuario no encontrado",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

### 8. Actualizar Perfil de Usuario
**Endpoint:** `PUT /api/users/profile`  
**Descripción:** Actualiza el perfil del usuario autenticado  
**Historia de Usuario:** "Como usuario quiero editar mi perfil"  
**Acceso:** STUDENT, INSTRUCTOR, ADMIN  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "userName": "Juan Carlos",
  "lastName": "Pérez González",
  "email": "juan.carlos.perez@example.com",
  "profileImageUrl": "https://example.com/profile-images/user_123.jpg"
}
```

#### Validaciones:
- **userName:** Requerido, 2-20 caracteres, solo letras y espacios
- **lastName:** Requerido, 2-20 caracteres, solo letras y espacios
- **email:** Requerido, formato email válido, máximo 100 caracteres, único
- **profileImageUrl:** Opcional, máximo 500 caracteres, URL válida de imagen

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "userName": "Juan Carlos",
  "lastName": "Pérez González",
  "email": "juan.carlos.perez@example.com",
  "role": "STUDENT",
  "isActive": true,
  "profileImageUrl": "https://example.com/profile-images/user_123.jpg",
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T12:30:00.000+00:00"
}
```

#### Response de Error (400 Bad Request):
```json
{
  "message": "El email ya está en uso por otro usuario",
  "status": 400,
  "timestamp": "2025-01-01T10:00:00"
}
```

#### Response de Error (422 Unprocessable Entity):
```json
{
  "message": "Datos de entrada inválidos",
  "errors": [
    {
      "field": "userName",
      "message": "El nombre debe tener entre 2 y 20 caracteres"
    },
    {
      "field": "email",
      "message": "El formato del email no es válido"
    }
  ],
  "status": 422,
  "timestamp": "2025-01-01T10:00:00"
}
```

## 📚 Endpoints de Cursos

### 9. Crear Curso
**Endpoint:** `POST /api/courses`  
**Descripción:** Crea un nuevo curso en la plataforma  
**Acceso:** INSTRUCTOR, ADMIN  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "title": "Curso de Java Básico",
  "description": "Aprende Java desde cero con ejemplos prácticos y proyectos reales.",
  "shortDescription": "Curso introductorio de Java para principiantes",
  "instructorId": 2,
  "categoryId": 1,
  "subcategoryId": 3,
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=abc123",
    "https://www.youtube.com/watch?v=def456"
  ],
  "thumbnailUrl": "https://example.com/images/java-course.jpg",
  "price": 99.99,
  "isPremium": true,
  "isPublished": false,
  "isActive": true,
  "estimatedHours": 20
}
```

#### Validaciones:
- **title:** Requerido, máximo 200 caracteres
- **description:** Requerido, máximo 1000 caracteres
- **shortDescription:** Opcional, máximo 255 caracteres
- **instructorId:** Requerido, debe existir
- **categoryId:** Requerido, debe existir
- **subcategoryId:** Requerido, debe existir y pertenecer a la categoría
- **youtubeUrls:** Opcional, formato YouTube válido
- **thumbnailUrl:** Opcional, URL de imagen válida
- **price:** Requerido, no negativo, máximo 6 dígitos enteros y 2 decimales
- **estimatedHours:** Opcional, entre 1 y 1000

#### Response Exitoso (201 Created):
```json
{
  "id": 1,
  "title": "Curso de Java Básico",
  "description": "Aprende Java desde cero con ejemplos prácticos y proyectos reales.",
  "shortDescription": "Curso introductorio de Java para principiantes",
  "instructor": {
    "id": 2,
    "userName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "role": "INSTRUCTOR"
  },
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "subcategory": {
    "id": 3,
    "name": "Backend"
  },
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=abc123",
    "https://www.youtube.com/watch?v=def456"
  ],
  "thumbnailUrl": "https://example.com/images/java-course.jpg",
  "price": 99.99,
  "isPremium": true,
  "isPublished": false,
  "isActive": true,
  "estimatedHours": 20,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

### 10. Catálogo Público de Cursos
**Endpoint:** `GET /api/courses`  
**Descripción:** Obtiene todos los cursos activos y publicados  
**Acceso:** Público  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero con ejemplos prácticos.",
    "shortDescription": "Curso introductorio de Java",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "García",
      "email": "maria.garcia@example.com",
      "role": "INSTRUCTOR"
    },
    "thumbnailUrl": "https://example.com/images/java-course.jpg",
    "price": 99.99,
    "isPremium": true,
    "estimatedHours": 20,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 11. Detalle de Curso
**Endpoint:** `GET /api/courses/{id}`  
**Descripción:** Obtiene el detalle completo de un curso específico  
**Acceso:** Público  

#### Path Parameters:
- **id:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "title": "Curso de Java Básico",
  "description": "Aprende Java desde cero con ejemplos prácticos y proyectos reales.",
  "shortDescription": "Curso introductorio de Java para principiantes",
  "instructor": {
    "id": 2,
    "userName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "role": "INSTRUCTOR"
  },
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=abc123",
    "https://www.youtube.com/watch?v=def456"
  ],
  "thumbnailUrl": "https://example.com/images/java-course.jpg",
  "price": 99.99,
  "isPremium": true,
  "isPublished": true,
  "isActive": true,
  "estimatedHours": 20,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Curso no encontrado con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

### 12. Cursos por Instructor
**Endpoint:** `GET /api/courses/instructor/{instructorId}`  
**Descripción:** Obtiene todos los cursos de un instructor específico  
**Acceso:** INSTRUCTOR (propio), ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **instructorId:** ID del instructor (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "García"
    },
    "price": 99.99,
    "isPublished": true,
    "estimatedHours": 20,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 13. Gestión Administrativa de Cursos
**Endpoint:** `GET /api/courses/admin/active`  
**Descripción:** Obtiene todos los cursos activos para gestión administrativa  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Curso de Java Básico",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "García"
    },
    "price": 99.99,
    "isPremium": true,
    "isPublished": true,
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 14. Actualizar Curso
**Endpoint:** `PUT /api/courses/{courseId}`  
**Descripción:** Actualiza un curso existente. Solo el instructor propietario o un administrador puede editar el curso  
**Historia de Usuario:** "Como instructor quiero editar mis cursos"  
**Acceso:** INSTRUCTOR (propietario), ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso a actualizar (requerido)

#### Request Body:
```json
{
  "title": "Curso de Java Avanzado",
  "description": "Aprende conceptos avanzados de Java con ejemplos prácticos y proyectos complejos.",
  "shortDescription": "Curso avanzado de Java para desarrolladores",
  "instructorId": 2,
  "categoryId": 1,
  "subcategoryId": 3,
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=xyz789",
    "https://www.youtube.com/watch?v=abc456"
  ],
  "thumbnailUrl": "https://example.com/images/java-advanced-course.jpg",
  "price": 149.99,
  "isPremium": true,
  "isPublished": true,
  "isActive": true,
  "estimatedHours": 35
}
```

#### Validaciones:
- **title:** Requerido, máximo 200 caracteres
- **description:** Requerido, máximo 1000 caracteres
- **shortDescription:** Opcional, máximo 255 caracteres
- **instructorId:** Requerido, debe existir
- **categoryId:** Requerido, debe existir
- **subcategoryId:** Requerido, debe existir y pertenecer a la categoría
- **youtubeUrls:** Opcional, formato YouTube válido
- **thumbnailUrl:** Opcional, URL de imagen válida
- **price:** Requerido, no negativo, máximo 6 dígitos enteros y 2 decimales
- **estimatedHours:** Opcional, entre 1 y 1000

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "title": "Curso de Java Avanzado",
  "description": "Aprende conceptos avanzados de Java con ejemplos prácticos y proyectos complejos.",
  "shortDescription": "Curso avanzado de Java para desarrolladores",
  "instructor": {
    "id": 2,
    "userName": "María",
    "lastName": "García",
    "email": "maria.garcia@example.com",
    "role": "INSTRUCTOR"
  },
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "subcategory": {
    "id": 3,
    "name": "Backend"
  },
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=xyz789",
    "https://www.youtube.com/watch?v=abc456"
  ],
  "thumbnailUrl": "https://example.com/images/java-advanced-course.jpg",
  "price": 149.99,
  "isPremium": true,
  "isPublished": true,
  "isActive": true,
  "estimatedHours": 35,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T15:30:00.000+00:00"
}
```

#### Response de Error (403 Forbidden):
```json
{
  "message": "No tienes permisos para editar este curso",
  "error": "ACCESS_DENIED",
  "status": 403,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/api/courses/1"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Curso no encontrado con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

### 15. Eliminar Curso
**Endpoint:** `DELETE /api/courses/{courseId}`  
**Descripción:** Desactiva un curso y todas sus inscripciones asociadas (soft delete). Solo el instructor propietario o un administrador puede eliminar el curso  
**Historia de Usuario:** "Como instructor quiero eliminar mis cursos"  
**Acceso:** INSTRUCTOR (propietario), ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso a eliminar (requerido)

#### Response Exitoso (204 No Content):
```
Sin contenido en el cuerpo de la respuesta
```

#### Response de Error (403 Forbidden):
```json
{
  "message": "No tienes permisos para eliminar este curso",
  "error": "ACCESS_DENIED",
  "status": 403,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/api/courses/1"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Curso no encontrado con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

#### Nota Importante:
- El curso se marca como inactivo (`isActive = false`) en lugar de eliminarse físicamente
- Todas las inscripciones asociadas al curso cambian su estado a `DROPPED`
- Esta operación es irreversible sin intervención administrativa

### 16. Cursos por Categoría
**Endpoint:** `GET /api/courses/category/{categoryId}`  
**Descripción:** Obtiene todos los cursos activos y publicados de una categoría específica  
**Acceso:** Público  

#### Path Parameters:
- **categoryId:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero con ejemplos prácticos.",
    "shortDescription": "Curso introductorio de Java",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "García"
    },
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "thumbnailUrl": "https://example.com/images/java-course.jpg",
    "price": 99.99,
    "isPremium": true,
    "estimatedHours": 20,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 17. Cursos por Subcategoría
**Endpoint:** `GET /api/courses/subcategory/{subcategoryId}`  
**Descripción:** Obtiene todos los cursos activos y publicados de una subcategoría específica  
**Acceso:** Público  

#### Path Parameters:
- **subcategoryId:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero con ejemplos prácticos.",
    "shortDescription": "Curso introductorio de Java",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "García"
    },
    "subcategory": {
      "id": 3,
      "name": "Backend"
    },
    "thumbnailUrl": "https://example.com/images/java-course.jpg",
    "price": 99.99,
    "isPremium": true,
    "estimatedHours": 20,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 18. Cursos por Categoría y Subcategoría
**Endpoint:** `GET /api/courses/category/{categoryId}/subcategory/{subcategoryId}`  
**Descripción:** Obtiene todos los cursos activos y publicados de una categoría y subcategoría específicas  
**Acceso:** Público  

#### Path Parameters:
- **categoryId:** ID de la categoría (requerido)
- **subcategoryId:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero con ejemplos prácticos.",
    "shortDescription": "Curso introductorio de Java",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "García"
    },
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "subcategory": {
      "id": 3,
      "name": "Backend"
    },
    "thumbnailUrl": "https://example.com/images/java-course.jpg",
    "price": 99.99,
    "isPremium": true,
    "estimatedHours": 20,
    "createdAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 19. Cambiar Estado de Publicación de Curso
**Endpoint:** `PATCH /api/courses/{courseId}/publish`  
**Descripción:** Cambia el estado de publicación de un curso (publicar/despublicar). Solo el instructor propietario o un administrador puede cambiar el estado  
**Historia de Usuario:** "Como instructor quiero publicar/despublicar mis cursos"  
**Acceso:** INSTRUCTOR (propietario), ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "title": "Curso de Java Básico",
  "description": "Aprende Java desde cero con ejemplos prácticos y proyectos reales.",
  "shortDescription": "Curso introductorio de Java para principiantes",
  "instructor": {
    "id": 2,
    "userName": "María",
    "lastName": "González",
    "email": "maria@example.com",
    "role": "INSTRUCTOR"
  },
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "subcategory": {
    "id": 3,
    "name": "Backend"
  },
  "youtubeUrls": [
    "https://www.youtube.com/watch?v=abc123"
  ],
  "thumbnailUrl": "https://example.com/images/java-course.jpg",
  "price": 99.99,
  "isPremium": true,
  "isPublished": true,
  "isActive": true,
  "estimatedHours": 20,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T15:30:00.000+00:00"
}
```

#### Response de Error (403 Forbidden):
```json
{
  "message": "No tienes permisos para modificar este curso",
  "error": "ACCESS_DENIED",
  "status": 403,
  "timestamp": "2025-01-01T10:00:00",
  "path": "/api/courses/1/publish"
}
```

#### Response de Error (404 Not Found):
```json
{
  "message": "Curso no encontrado con ID: 999",
  "status": 404,
  "timestamp": "2025-01-01T10:00:00"
}
```

## 📊 Endpoints de Estadísticas Administrativas

### 20. Obtener Estadísticas del Sistema
**Endpoint:** `GET /api/admin/stats`  
**Descripción:** Obtiene estadísticas generales del sistema para el panel de administración  
**Historia de Usuario:** "Como administrador quiero ver estadísticas del sistema"  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
{
  "totalUsers": 150,
  "totalStudents": 120,
  "totalInstructors": 25,
  "totalAdmins": 5,
  "totalCourses": 45,
  "publishedCourses": 38,
  "unpublishedCourses": 7,
  "totalEnrollments": 320,
  "activeEnrollments": 280,
  "completedEnrollments": 40,
  "totalCategories": 8,
  "totalSubcategories": 24,
  "revenueTotal": 15480.50,
  "newUsersThisMonth": 12,
  "newCoursesThisMonth": 3,
  "newEnrollmentsThisMonth": 45
}
```

## 🗂️ Endpoints de Categorías

### 21. Catálogo de Categorías Activas
**Endpoint:** `GET /api/categories`  
**Descripción:** Obtiene todas las categorías activas del sistema  
**Acceso:** Público  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Programación",
    "description": "Cursos de desarrollo de software",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "name": "Diseño",
    "description": "Cursos de diseño gráfico y UX/UI",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 22. Gestión de Categorías (Admin)
**Endpoint:** `GET /api/categories/all`  
**Descripción:** Obtiene todas las categorías del sistema (activas e inactivas)  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Programación",
    "description": "Cursos de desarrollo de software",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 3,
    "name": "Marketing Digital",
    "description": "Cursos de marketing online",
    "isActive": false,
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T12:00:00.000+00:00"
  }
]
```

### 23. Obtener Categoría por ID
**Endpoint:** `GET /api/categories/{id}`  
**Descripción:** Obtiene una categoría específica por su ID  
**Acceso:** Público  

#### Path Parameters:
- **id:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Programación",
  "description": "Cursos de desarrollo de software",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

### 24. Buscar Categorías
**Endpoint:** `GET /api/categories/search`  
**Descripción:** Busca categorías por nombre  
**Acceso:** Público  

#### Query Parameters:
- **q:** Término de búsqueda (opcional)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Programación",
    "description": "Cursos de desarrollo de software",
    "isActive": true,
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 25. Crear Categoría
**Endpoint:** `POST /api/categories`  
**Descripción:** Crea una nueva categoría  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "name": "Inteligencia Artificial",
  "description": "Cursos de machine learning y AI"
}
```

#### Response Exitoso (201 Created):
```json
{
  "id": 9,
  "name": "Inteligencia Artificial",
  "description": "Cursos de machine learning y AI",
  "isActive": true,
  "createdAt": "2025-01-01T15:00:00.000+00:00",
  "updatedAt": "2025-01-01T15:00:00.000+00:00"
}
```

### 26. Actualizar Categoría
**Endpoint:** `PUT /api/categories/{id}`  
**Descripción:** Actualiza una categoría existente  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la categoría (requerido)

#### Request Body:
```json
{
  "name": "Desarrollo de Software",
  "description": "Cursos de programación y desarrollo"
}
```

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Desarrollo de Software",
  "description": "Cursos de programación y desarrollo",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T16:00:00.000+00:00"
}
```

### 27. Eliminar Categoría (Soft Delete)
**Endpoint:** `DELETE /api/categories/{id}`  
**Descripción:** Marca una categoría como inactiva (soft delete)  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "message": "Categoría eliminada exitosamente"
}
```

### 28. Eliminar Categoría Permanentemente
**Endpoint:** `DELETE /api/categories/{id}/permanent`  
**Descripción:** Elimina permanentemente una categoría del sistema  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "message": "Categoría eliminada permanentemente"
}
```

### 29. Activar Categoría
**Endpoint:** `PUT /api/categories/{id}/activate`  
**Descripción:** Activa una categoría previamente desactivada  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Programación",
  "description": "Cursos de desarrollo de software",
  "isActive": true,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T17:00:00.000+00:00"
}
```

### 30. Desactivar Categoría
**Endpoint:** `PUT /api/categories/{id}/deactivate`  
**Descripción:** Desactiva una categoría  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Programación",
  "description": "Cursos de desarrollo de software",
  "isActive": false,
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T17:30:00.000+00:00"
}
```

## 🏷️ Endpoints de Subcategorías

### 31. Catálogo de Subcategorías Activas
**Endpoint:** `GET /api/subcategories`  
**Descripción:** Obtiene todas las subcategorías activas del sistema  
**Acceso:** Público  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Frontend",
    "description": "Desarrollo de interfaces de usuario",
    "isActive": true,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "name": "Backend",
    "description": "Desarrollo de servicios del servidor",
    "isActive": true,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 32. Gestión de Subcategorías (Admin)
**Endpoint:** `GET /api/subcategories/all`  
**Descripción:** Obtiene todas las subcategorías del sistema (activas e inactivas)  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Frontend",
    "description": "Desarrollo de interfaces de usuario",
    "isActive": true,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 5,
    "name": "Mobile",
    "description": "Desarrollo de aplicaciones móviles",
    "isActive": false,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T12:00:00.000+00:00"
  }
]
```

### 33. Obtener Subcategoría por ID
**Endpoint:** `GET /api/subcategories/{id}`  
**Descripción:** Obtiene una subcategoría específica por su ID  
**Acceso:** Público  

#### Path Parameters:
- **id:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Frontend",
  "description": "Desarrollo de interfaces de usuario",
  "isActive": true,
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

### 34. Obtener Subcategorías por Categoría
**Endpoint:** `GET /api/subcategories/category/{categoryId}`  
**Descripción:** Obtiene todas las subcategorías activas de una categoría específica  
**Acceso:** Público  

#### Path Parameters:
- **categoryId:** ID de la categoría (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Frontend",
    "description": "Desarrollo de interfaces de usuario",
    "isActive": true,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  },
  {
    "id": 2,
    "name": "Backend",
    "description": "Desarrollo de servicios del servidor",
    "isActive": true,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 35. Buscar Subcategorías
**Endpoint:** `GET /api/subcategories/search`  
**Descripción:** Busca subcategorías por nombre  
**Acceso:** Público  

#### Query Parameters:
- **q:** Término de búsqueda (opcional)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "name": "Frontend",
    "description": "Desarrollo de interfaces de usuario",
    "isActive": true,
    "category": {
      "id": 1,
      "name": "Programación"
    },
    "createdAt": "2025-01-01T10:00:00.000+00:00",
    "updatedAt": "2025-01-01T10:00:00.000+00:00"
  }
]
```

### 36. Crear Subcategoría
**Endpoint:** `POST /api/subcategories`  
**Descripción:** Crea una nueva subcategoría  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "name": "DevOps",
  "description": "Desarrollo y operaciones",
  "categoryId": 1
}
```

#### Response Exitoso (201 Created):
```json
{
  "id": 6,
  "name": "DevOps",
  "description": "Desarrollo y operaciones",
  "isActive": true,
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "createdAt": "2025-01-01T15:00:00.000+00:00",
  "updatedAt": "2025-01-01T15:00:00.000+00:00"
}
```

### 37. Actualizar Subcategoría
**Endpoint:** `PUT /api/subcategories/{id}`  
**Descripción:** Actualiza una subcategoría existente  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la subcategoría (requerido)

#### Request Body:
```json
{
  "name": "Desarrollo Frontend",
  "description": "Desarrollo de interfaces web modernas",
  "categoryId": 1
}
```

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Desarrollo Frontend",
  "description": "Desarrollo de interfaces web modernas",
  "isActive": true,
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T16:00:00.000+00:00"
}
```

### 38. Eliminar Subcategoría (Soft Delete)
**Endpoint:** `DELETE /api/subcategories/{id}`  
**Descripción:** Marca una subcategoría como inactiva (soft delete)  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "message": "Subcategoría eliminada exitosamente"
}
```

### 39. Eliminar Subcategoría Permanentemente
**Endpoint:** `DELETE /api/subcategories/{id}/permanent`  
**Descripción:** Elimina permanentemente una subcategoría del sistema  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "message": "Subcategoría eliminada permanentemente"
}
```

### 40. Activar Subcategoría
**Endpoint:** `PUT /api/subcategories/{id}/activate`  
**Descripción:** Activa una subcategoría previamente desactivada  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Frontend",
  "description": "Desarrollo de interfaces de usuario",
  "isActive": true,
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T17:00:00.000+00:00"
}
```

### 41. Desactivar Subcategoría
**Endpoint:** `PUT /api/subcategories/{id}/deactivate`  
**Descripción:** Desactiva una subcategoría  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la subcategoría (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "name": "Frontend",
  "description": "Desarrollo de interfaces de usuario",
  "isActive": false,
  "category": {
    "id": 1,
    "name": "Programación"
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T17:30:00.000+00:00"
}
```

## � Endpoints de Inscripciones (Enrollments)

### 42. Inscribirse en un Curso
**Endpoint:** `POST /api/enrollments`  
**Descripción:** Permite a un estudiante inscribirse en un curso  
**Historia de Usuario:** "Como estudiante quiero inscribirme en un curso"  
**Acceso:** STUDENT  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "courseId": 1
}
```

#### Response Exitoso (201 Created):
```json
{
  "id": 1,
  "student": {
    "id": 3,
    "userName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "role": "STUDENT"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "González"
    }
  },
  "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
  "status": "ACTIVE",
  "progressPercentage": 0,
  "completedAt": null
}
```

#### Response de Error (400 Bad Request):
```json
{
  "message": "Ya estás inscrito en este curso"
}
```

### 43. Mis Cursos Activos
**Endpoint:** `GET /api/enrollments/my-courses`  
**Descripción:** Obtiene todas las inscripciones activas del estudiante autenticado  
**Historia de Usuario:** "Como estudiante quiero ver mis cursos activos"  
**Acceso:** STUDENT  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "student": {
      "id": 3,
      "userName": "Juan",
      "lastName": "Pérez"
    },
    "course": {
      "id": 1,
      "title": "Curso de Java Básico",
      "thumbnailUrl": "https://example.com/images/java-course.jpg",
      "instructor": {
        "id": 2,
        "userName": "María",
        "lastName": "González"
      }
    },
    "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
    "status": "ACTIVE",
    "progressPercentage": 45,
    "completedAt": null
  }
]
```

### 44. Historial Completo de Inscripciones
**Endpoint:** `GET /api/enrollments/my-courses/all`  
**Descripción:** Obtiene todas las inscripciones del estudiante (activas, completadas, suspendidas)  
**Historia de Usuario:** "Como estudiante quiero ver mi historial completo de cursos"  
**Acceso:** STUDENT  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "course": {
      "id": 1,
      "title": "Curso de Java Básico"
    },
    "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
    "status": "ACTIVE",
    "progressPercentage": 45
  },
  {
    "id": 2,
    "course": {
      "id": 2,
      "title": "Curso de React"
    },
    "enrollmentDate": "2024-12-15T10:00:00.000+00:00",
    "status": "COMPLETED",
    "progressPercentage": 100,
    "completedAt": "2025-01-01T08:00:00.000+00:00"
  }
]
```

### 45. Mis Cursos Completados
**Endpoint:** `GET /api/enrollments/my-courses/completed`  
**Descripción:** Obtiene todas las inscripciones completadas del estudiante  
**Historia de Usuario:** "Como estudiante quiero ver mis cursos completados"  
**Acceso:** STUDENT  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 2,
    "course": {
      "id": 2,
      "title": "Curso de React",
      "thumbnailUrl": "https://example.com/images/react-course.jpg",
      "instructor": {
        "id": 2,
        "userName": "María",
        "lastName": "González"
      }
    },
    "enrollmentDate": "2024-12-15T10:00:00.000+00:00",
    "status": "COMPLETED",
    "progressPercentage": 100,
    "completedAt": "2025-01-01T08:00:00.000+00:00"
  }
]
```

### 46. Obtener Inscripción por ID
**Endpoint:** `GET /api/enrollments/{id}`  
**Descripción:** Obtiene los detalles de una inscripción específica  
**Acceso:** STUDENT, INSTRUCTOR, ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la inscripción (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "student": {
    "id": 3,
    "userName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero"
  },
  "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
  "status": "ACTIVE",
  "progressPercentage": 45,
  "completedAt": null
}
```

### 47. Verificar Estado de Inscripción
**Endpoint:** `GET /api/enrollments/check/{courseId}`  
**Descripción:** Verifica si el estudiante está inscrito en un curso específico  
**Historia de Usuario:** "Como estudiante quiero saber si estoy inscrito en un curso"  
**Acceso:** STUDENT  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
{
  "enrolled": true,
  "enrollmentId": 1,
  "status": "ACTIVE",
  "progressPercentage": 45
}
```

#### Response cuando no está inscrito (200 OK):
```json
{
  "enrolled": false
}
```

### 48. Actualizar Progreso del Curso
**Endpoint:** `PUT /api/enrollments/{id}/progress`  
**Descripción:** Actualiza el porcentaje de progreso de una inscripción  
**Historia de Usuario:** "Como estudiante quiero actualizar mi progreso en el curso"  
**Acceso:** STUDENT (propio)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la inscripción (requerido)

#### Request Body:
```json
{
  "progressPercentage": 75
}
```

#### Validaciones:
- **progressPercentage:** Entre 0 y 100

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "student": {
    "id": 3,
    "userName": "Juan",
    "lastName": "Pérez"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico"
  },
  "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
  "status": "ACTIVE",
  "progressPercentage": 75,
  "completedAt": null,
  "updatedAt": "2025-01-01T15:30:00.000+00:00"
}
```

### 49. Marcar Curso como Completado
**Endpoint:** `PUT /api/enrollments/{id}/complete`  
**Descripción:** Marca una inscripción como completada (progreso automático al 100%)  
**Historia de Usuario:** "Como estudiante quiero marcar un curso como completado"  
**Acceso:** STUDENT (propio)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la inscripción (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "student": {
    "id": 3,
    "userName": "Juan",
    "lastName": "Pérez"
  },
  "course": {
    "id": 1,
    "title": "Curso de Java Básico"
  },
  "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
  "status": "COMPLETED",
  "progressPercentage": 100,
  "completedAt": "2025-01-01T16:00:00.000+00:00"
}
```

### 50. Desinscribirse de un Curso
**Endpoint:** `DELETE /api/enrollments/{id}`  
**Descripción:** Permite a un estudiante desinscribirse de un curso  
**Historia de Usuario:** "Como estudiante quiero desinscribirme de un curso"  
**Acceso:** STUDENT (propio)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **id:** ID de la inscripción (requerido)

#### Response Exitoso (200 OK):
```json
{
  "message": "Te has desinscrito exitosamente del curso"
}
```

#### Response de Error (403 Forbidden):
```json
{
  "message": "No tienes permisos para desinscribirte de este curso"
}
```

### 51. Inscripciones de un Curso (Instructor/Admin)
**Endpoint:** `GET /api/enrollments/course/{courseId}`  
**Descripción:** Obtiene todas las inscripciones activas de un curso específico  
**Historia de Usuario:** "Como instructor quiero ver los estudiantes inscritos en mi curso"  
**Acceso:** INSTRUCTOR, ADMIN  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "student": {
      "id": 3,
      "userName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com"
    },
    "enrollmentDate": "2025-01-01T10:00:00.000+00:00",
    "status": "ACTIVE",
    "progressPercentage": 45
  },
  {
    "id": 2,
    "student": {
      "id": 4,
      "userName": "Ana",
      "lastName": "López",
      "email": "ana@example.com"
    },
    "enrollmentDate": "2025-01-01T12:00:00.000+00:00",
    "status": "ACTIVE",
    "progressPercentage": 20
  }
]
```

### 52. Estadísticas de Inscripciones (Admin)
**Endpoint:** `GET /api/enrollments/stats`  
**Descripción:** Obtiene estadísticas generales de inscripciones para administradores  
**Historia de Usuario:** "Como administrador quiero ver estadísticas de inscripciones"  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "courseName": "Curso de Java Básico",
    "totalEnrollments": 45,
    "activeEnrollments": 32,
    "completedEnrollments": 13
  },
  {
    "courseName": "Curso de React",
    "totalEnrollments": 38,
    "activeEnrollments": 25,
    "completedEnrollments": 13
  }
]
```

### 53. Inscripciones Recientes (Admin)
**Endpoint:** `GET /api/enrollments/recent`  
**Descripción:** Obtiene las inscripciones más recientes del sistema  
**Historia de Usuario:** "Como administrador quiero ver las inscripciones recientes"  
**Acceso:** ADMIN  
**Autenticación:** JWT Required  

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 25,
    "student": {
      "id": 8,
      "userName": "Carlos",
      "lastName": "Martínez"
    },
    "course": {
      "id": 3,
      "title": "Curso de Node.js"
    },
    "enrollmentDate": "2025-01-01T16:30:00.000+00:00",
    "status": "ACTIVE"
  },
  {
    "id": 24,
    "student": {
      "id": 7,
      "userName": "Laura",
      "lastName": "Rodríguez"
    },
    "course": {
      "id": 1,
      "title": "Curso de Java Básico"
    },
    "enrollmentDate": "2025-01-01T15:45:00.000+00:00",
    "status": "ACTIVE"
  }
]
```

## 🎥 Endpoints de Videos de Cursos

### 54. Agregar Video a Curso
**Endpoint:** `POST /api/course-videos`  
**Descripción:** Permite a un instructor agregar un video a su curso  
**Historia de Usuario:** "Como instructor quiero agregar videos a mi curso"  
**Acceso:** INSTRUCTOR  
**Autenticación:** JWT Required  

#### Request Body:
```json
{
  "courseId": 1,
  "title": "Introducción a Java",
  "description": "Conceptos básicos del lenguaje Java",
  "videoUrl": "https://www.youtube.com/watch?v=abc123",
  "duration": 1200,
  "orderIndex": 1,
  "isPreview": true
}
```

#### Validaciones:
- **title:** Requerido, máximo 200 caracteres
- **description:** Opcional, máximo 1000 caracteres
- **videoUrl:** Requerido, URL válida de YouTube
- **duration:** Duración en segundos
- **orderIndex:** Orden del video en el curso
- **isPreview:** Si el video es preview gratuito

#### Response Exitoso (201 Created):
```json
{
  "id": 1,
  "title": "Introducción a Java",
  "description": "Conceptos básicos del lenguaje Java",
  "videoUrl": "https://www.youtube.com/watch?v=abc123",
  "duration": 1200,
  "orderIndex": 1,
  "isPreview": true,
  "course": {
    "id": 1,
    "title": "Curso de Java Básico"
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

### 55. Obtener Videos de un Curso
**Endpoint:** `GET /api/course-videos/course/{courseId}`  
**Descripción:** Obtiene todos los videos de un curso, ordenados por orderIndex  
**Historia de Usuario:** "Como estudiante quiero ver los videos de un curso"  
**Acceso:** Público (videos preview), STUDENT (inscrito para videos completos)  
**Autenticación:** JWT Optional  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
[
  {
    "id": 1,
    "title": "Introducción a Java",
    "description": "Conceptos básicos del lenguaje Java",
    "videoUrl": "https://www.youtube.com/watch?v=abc123",
    "duration": 1200,
    "orderIndex": 1,
    "isPreview": true,
    "accessible": true
  },
  {
    "id": 2,
    "title": "Variables y Tipos de Datos",
    "description": "Aprende sobre variables en Java",
    "videoUrl": "https://www.youtube.com/watch?v=def456",
    "duration": 1800,
    "orderIndex": 2,
    "isPreview": false,
    "accessible": true
  }
]
```

#### Nota:
- **accessible:** Indica si el usuario puede acceder al video (basado en inscripción)
- Videos con **isPreview: false** requieren inscripción activa

### 56. Obtener Video por ID
**Endpoint:** `GET /api/course-videos/{videoId}`  
**Descripción:** Obtiene los detalles de un video específico  
**Acceso:** Público (videos preview), STUDENT (inscrito para videos completos)  
**Autenticación:** JWT Optional  

#### Path Parameters:
- **videoId:** ID del video (requerido)

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "title": "Introducción a Java",
  "description": "Conceptos básicos del lenguaje Java",
  "videoUrl": "https://www.youtube.com/watch?v=abc123",
  "duration": 1200,
  "orderIndex": 1,
  "isPreview": true,
  "course": {
    "id": 1,
    "title": "Curso de Java Básico",
    "instructor": {
      "id": 2,
      "userName": "María",
      "lastName": "González"
    }
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T10:00:00.000+00:00"
}
```

### 57. Actualizar Video
**Endpoint:** `PUT /api/course-videos/{videoId}`  
**Descripción:** Actualiza un video existente. Solo el instructor propietario puede editarlo  
**Historia de Usuario:** "Como instructor quiero editar los videos de mi curso"  
**Acceso:** INSTRUCTOR (propietario)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **videoId:** ID del video (requerido)

#### Request Body:
```json
{
  "title": "Introducción Completa a Java",
  "description": "Conceptos básicos y avanzados del lenguaje Java",
  "videoUrl": "https://www.youtube.com/watch?v=xyz789",
  "duration": 1500,
  "orderIndex": 1,
  "isPreview": true
}
```

#### Response Exitoso (200 OK):
```json
{
  "id": 1,
  "title": "Introducción Completa a Java",
  "description": "Conceptos básicos y avanzados del lenguaje Java",
  "videoUrl": "https://www.youtube.com/watch?v=xyz789",
  "duration": 1500,
  "orderIndex": 1,
  "isPreview": true,
  "course": {
    "id": 1,
    "title": "Curso de Java Básico"
  },
  "createdAt": "2025-01-01T10:00:00.000+00:00",
  "updatedAt": "2025-01-01T16:00:00.000+00:00"
}
```

### 58. Eliminar Video
**Endpoint:** `DELETE /api/course-videos/{videoId}`  
**Descripción:** Elimina un video del curso. Solo el instructor propietario puede eliminarlo  
**Historia de Usuario:** "Como instructor quiero eliminar videos de mi curso"  
**Acceso:** INSTRUCTOR (propietario)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **videoId:** ID del video (requerido)

#### Response Exitoso (204 No Content):
```
Sin contenido en el cuerpo de la respuesta
```

#### Response de Error (403 Forbidden):
```json
{
  "message": "No tienes permisos para eliminar este video"
}
```

### 59. Reordenar Videos de un Curso
**Endpoint:** `PUT /api/course-videos/course/{courseId}/reorder`  
**Descripción:** Cambia el orden de los videos en un curso  
**Historia de Usuario:** "Como instructor quiero cambiar el orden de los videos"  
**Acceso:** INSTRUCTOR (propietario)  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Request Body:
```json
[3, 1, 2, 4]
```
*Array con los IDs de los videos en el nuevo orden*

#### Response Exitoso (200 OK):
```
Sin contenido específico, status 200 OK indica éxito
```

### 60. Verificar Permisos de Gestión de Videos
**Endpoint:** `GET /api/course-videos/course/{courseId}/can-manage`  
**Descripción:** Verifica si el instructor puede gestionar los videos de un curso  
**Historia de Usuario:** "Como instructor quiero saber si puedo gestionar videos"  
**Acceso:** INSTRUCTOR  
**Autenticación:** JWT Required  

#### Path Parameters:
- **courseId:** ID del curso (requerido)

#### Response Exitoso (200 OK):
```json
true
```

#### Response cuando no tiene permisos (200 OK):
```json
false
```

## �🔒 Autenticación JWT

### Headers Requeridos para Endpoints Protegidos
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Configuración de Token
- **Algoritmo:** HMAC-SHA256
- **Expiración:** 24 horas (86400000 ms)
- **Tipo:** Bearer Token
- **Header:** `Authorization: Bearer <token>`

## 🗂️ Modelos de Datos

### Usuario (User)
```json
{
  "id": "number",
  "userName": "string",
  "lastName": "string", 
  "email": "string (unique)",
  "password": "string (encrypted)",
  "role": "STUDENT | INSTRUCTOR | ADMIN",
  "isActive": "boolean",
  "profileImageUrl": "string (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Perfil de Usuario (UserProfileDto)
```json
{
  "id": "number",
  "userName": "string",
  "lastName": "string",
  "email": "string",
  "role": "STUDENT | INSTRUCTOR | ADMIN",
  "isActive": "boolean",
  "profileImageUrl": "string (optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Actualización de Perfil (UpdateProfileDto)
```json
{
  "userName": "string (2-20 chars, letters and spaces only)",
  "lastName": "string (2-20 chars, letters and spaces only)",
  "email": "string (email format, max 100 chars, unique)",
  "profileImageUrl": "string (optional, max 500 chars, valid image URL)"
}
```

### Curso (Course)
```json
{
  "id": "number",
  "title": "string (max 200 chars)",
  "description": "string (max 1000 chars)",
  "shortDescription": "string (max 255 chars, optional)",
  "instructor": {
    "id": "number",
    "userName": "string",
    "lastName": "string",
    "email": "string",
    "role": "INSTRUCTOR"
  },
  "youtubeUrls": ["string[] (YouTube URLs)"],
  "thumbnailUrl": "string (image URL, optional)",
  "price": "decimal (8,2)",
  "isPremium": "boolean",
  "isPublished": "boolean",
  "isActive": "boolean",
  "estimatedHours": "number (1-1000, optional)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### Roles Disponibles
- **STUDENT:** Estudiante de la plataforma
- **INSTRUCTOR:** Instructor que puede crear cursos
- **ADMIN:** Administrador con acceso completo

## 🚨 Códigos de Estado HTTP

### Códigos de Éxito
- **200 OK:** Operación exitosa
- **201 Created:** Recurso creado exitosamente

### Códigos de Error del Cliente
- **400 Bad Request:** Datos de entrada inválidos
- **401 Unauthorized:** Token ausente, inválido o expirado
- **403 Forbidden:** Usuario inactivo o sin permisos
- **404 Not Found:** Recurso no encontrado
- **409 Conflict:** Conflicto de datos (ej: email duplicado)

### Códigos de Error del Servidor
- **500 Internal Server Error:** Error interno del servidor

## 🔧 Configuración de Desarrollo

### Base de Datos H2 (Desarrollo)
- **URL:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Username:** `sa`
- **Password:** `password`

### Variables de Entorno
```properties
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_TIME=86400000
```
############################################
                TESTING
############################################
               
## 🧪 Ejemplos de Testing

### 1. Prueba de Login (cURL)
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Prueba de Registro (cURL)
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Juan",
    "lastName": "Pérez", 
    "email": "juan.perez@example.com",
    "password": "password123",
    "role": "STUDENT"
  }'
```

### 3. Obtener Usuario por ID (cURL)
```bash
curl -X GET http://localhost:8080/api/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Obtener Usuarios por Rol (cURL)
```bash
curl -X GET http://localhost:8080/api/users/role/STUDENT \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 5. Obtener Todos los Usuarios (cURL)
```bash
curl -X GET http://localhost:8080/api/users/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 6. Obtener Perfil de Usuario (cURL)
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 7. Actualizar Perfil de Usuario (cURL)
```bash
curl -X PUT http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "Juan Carlos",
    "lastName": "Pérez González",
    "email": "juan.carlos.perez@example.com",
    "profileImageUrl": "https://example.com/profile-images/user_123.jpg"
  }'
```

### 8. Crear Curso (cURL)
```bash
curl -X POST http://localhost:8080/api/courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Curso de Java Básico",
    "description": "Aprende Java desde cero con ejemplos prácticos y proyectos reales.",
    "shortDescription": "Curso introductorio de Java para principiantes",
    "instructorId": 2,
    "categoryId": 1,
    "subcategoryId": 3,
    "youtubeUrls": [
      "https://www.youtube.com/watch?v=abc123"
    ],
    "thumbnailUrl": "https://example.com/images/java-course.jpg",
    "price": 99.99,
    "isPremium": true,
    "isPublished": false,
    "estimatedHours": 20
  }'
```

### 9. Obtener Catálogo de Cursos (cURL)
```bash
curl -X GET http://localhost:8080/api/courses \
  -H "Content-Type: application/json"
```

### 10. Obtener Detalle de Curso (cURL)
```bash
curl -X GET http://localhost:8080/api/courses/1 \
  -H "Content-Type: application/json"
```

### 11. Obtener Cursos por Instructor (cURL)
```bash
curl -X GET http://localhost:8080/api/courses/instructor/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 12. Acceso a Endpoint Protegido (cURL)
```bash
curl -X GET http://localhost:8080/api/protected-endpoint \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 13. Validación de Token (cURL)
```bash
curl -X GET "http://localhost:8080/auth/validate?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 14. Actualizar Curso (cURL)
```bash
curl -X PUT http://localhost:8080/api/courses/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Curso de Java Avanzado",
    "description": "Aprende conceptos avanzados de Java con ejemplos prácticos y proyectos complejos.",
    "shortDescription": "Curso avanzado de Java para desarrolladores",
    "instructorId": 2,
    "categoryId": 1,
    "subcategoryId": 3,
    "youtubeUrls": [
      "https://www.youtube.com/watch?v=xyz789",
      "https://www.youtube.com/watch?v=abc456"
    ],
    "thumbnailUrl": "https://example.com/images/java-advanced-course.jpg",
    "price": 149.99,
    "isPremium": true,
    "isPublished": true,
    "isActive": true,
    "estimatedHours": 35
  }'
```

### 15. Eliminar Curso (cURL)
```bash
curl -X DELETE http://localhost:8080/api/courses/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 16. Obtener Cursos por Categoría (cURL)
```bash
curl -X GET http://localhost:8080/api/courses/category/1 \
  -H "Content-Type: application/json"
```

### 17. Obtener Cursos por Subcategoría (cURL)
```bash
curl -X GET http://localhost:8080/api/courses/subcategory/3 \
  -H "Content-Type: application/json"
```

### 18. Obtener Cursos por Categoría y Subcategoría (cURL)
```bash
curl -X GET http://localhost:8080/api/courses/category/1/subcategory/3 \
  -H "Content-Type: application/json"
```

### 19. Cambiar Estado de Publicación de Curso (cURL)
```bash
curl -X PATCH http://localhost:8080/api/courses/1/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 20. Obtener Estadísticas Administrativas (cURL)
```bash
curl -X GET http://localhost:8080/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 21. Obtener Categorías (cURL)
```bash
curl -X GET http://localhost:8080/api/categories \
  -H "Content-Type: application/json"
```

### 22. Crear Categoría (cURL)
```bash
curl -X POST http://localhost:8080/api/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Inteligencia Artificial",
    "description": "Cursos de machine learning y AI"
  }'
```

### 23. Obtener Subcategorías por Categoría (cURL)
```bash
curl -X GET http://localhost:8080/api/subcategories/category/1 \
  -H "Content-Type: application/json"
```

### 24. Inscribirse en un Curso (cURL)
```bash
curl -X POST http://localhost:8080/api/enrollments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1
  }'
```

### 25. Obtener Mis Cursos Activos (cURL)
```bash
curl -X GET http://localhost:8080/api/enrollments/my-courses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 26. Verificar Estado de Inscripción (cURL)
```bash
curl -X GET http://localhost:8080/api/enrollments/check/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### 27. Actualizar Progreso del Curso (cURL)
```bash
curl -X PUT http://localhost:8080/api/enrollments/1/progress \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "progressPercentage": 75
  }'
```

### 28. Agregar Video a Curso (cURL)
```bash
curl -X POST http://localhost:8080/api/course-videos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1,
    "title": "Introducción a Java",
    "description": "Conceptos básicos del lenguaje Java",
    "videoUrl": "https://www.youtube.com/watch?v=abc123",
    "duration": 1200,
    "orderIndex": 1,
    "isPreview": true
  }'
```

### 29. Obtener Videos de un Curso (cURL)
```bash
curl -X GET http://localhost:8080/api/course-videos/course/1 \
  -H "Content-Type: application/json"
```

### 30. Reordenar Videos de un Curso (cURL)
```bash
curl -X PUT http://localhost:8080/api/course-videos/course/1/reorder \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[3, 1, 2, 4]'
```

## 📱 Integración con Frontend

### Flujo de Autenticación Recomendado
1. **Login:** Usuario ingresa credenciales
2. **Almacenar Token:** Guardar JWT en localStorage/sessionStorage
3. **Requests:** Incluir token en header Authorization
4. **Validación:** Verificar token antes de operaciones sensibles
5. **Logout:** Eliminar token del storage

### Ejemplo JavaScript (React)
```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:8080/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    return data;
  } else {
    throw new Error(data.message);
  }
};

// Request autenticado
const fetchProtectedData = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:8080/api/protected-endpoint', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  return response.json();
};
```

## 🛡️ Seguridad y Validaciones

### Validaciones de Backend
- **Email:** Formato válido, único en sistema
- **Password:** Mínimo 6 caracteres, encriptación BCrypt
- **Token JWT:** Validación de firma y expiración
- **CORS:** Configurado para aceptar todos los orígenes (desarrollo)

### Recomendaciones de Seguridad
- **HTTPS:** Usar en producción
- **Token Storage:** Evitar localStorage en producción, usar httpOnly cookies
- **Rate Limiting:** Implementar límites de requests
- **Validation:** Validar siempre datos de entrada
- **Error Handling:** No exponer información sensible en errores

## 🔄 Estados de Endpoints

### Endpoints Públicos (No requieren autenticación)
- `POST /auth/login` - Login de usuario
- `GET /auth/validate` - Validación de token
- `POST /api/users/register` - Registro de usuario
- `GET /api/courses` - Catálogo público de cursos
- `GET /api/courses/{id}` - Detalle del curso
- `GET /api/courses/category/{categoryId}` - Cursos por categoría
- `GET /api/courses/subcategory/{subcategoryId}` - Cursos por subcategoría
- `GET /api/courses/category/{categoryId}/subcategory/{subcategoryId}` - Cursos por categoría y subcategoría
- `GET /api/categories` - Catálogo de categorías activas
- `GET /api/categories/{id}` - Obtener categoría por ID
- `GET /api/categories/search` - Buscar categorías
- `GET /api/subcategories` - Catálogo de subcategorías activas
- `GET /api/subcategories/{id}` - Obtener subcategoría por ID
- `GET /api/subcategories/category/{categoryId}` - Subcategorías por categoría
- `GET /api/subcategories/search` - Buscar subcategorías
- `GET /api/course-videos/course/{courseId}` - Videos de curso (solo preview sin auth)
- `GET /api/course-videos/{videoId}` - Detalle de video (solo preview sin auth)
- `GET /h2-console/**` - Consola H2 (solo desarrollo)
- `GET /actuator/health` - Health check

### Endpoints Protegidos (Requieren JWT)

#### Solo ADMIN
- `GET /api/users/{id}` - Obtener usuario por ID
- `GET /api/users/role/{role}` - Obtener usuarios por rol
- `GET /api/users/all` - Obtener todos los usuarios
- `GET /api/courses/admin/active` - Gestión administrativa de cursos
- `GET /api/admin/stats` - Estadísticas del sistema
- `GET /api/categories/all` - Todas las categorías (activas e inactivas)
- `POST /api/categories` - Crear categoría
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Eliminar categoría (soft delete)
- `DELETE /api/categories/{id}/permanent` - Eliminar categoría permanentemente
- `PUT /api/categories/{id}/activate` - Activar categoría
- `PUT /api/categories/{id}/deactivate` - Desactivar categoría
- `GET /api/subcategories/all` - Todas las subcategorías (activas e inactivas)
- `POST /api/subcategories` - Crear subcategoría
- `PUT /api/subcategories/{id}` - Actualizar subcategoría
- `DELETE /api/subcategories/{id}` - Eliminar subcategoría (soft delete)
- `DELETE /api/subcategories/{id}/permanent` - Eliminar subcategoría permanentemente
- `PUT /api/subcategories/{id}/activate` - Activar subcategoría
- `PUT /api/subcategories/{id}/deactivate` - Desactivar subcategoría
- `GET /api/enrollments/stats` - Estadísticas de inscripciones
- `GET /api/enrollments/recent` - Inscripciones recientes

#### INSTRUCTOR y ADMIN
- `POST /api/courses` - Crear curso
- `PUT /api/courses/{courseId}` - Actualizar curso (propietario o admin)
- `DELETE /api/courses/{courseId}` - Eliminar curso (propietario o admin)
- `PATCH /api/courses/{courseId}/publish` - Cambiar estado de publicación (propietario o admin)
- `GET /api/enrollments/course/{courseId}` - Inscripciones de un curso

#### Solo INSTRUCTOR
- `POST /api/course-videos` - Agregar video a curso
- `PUT /api/course-videos/{videoId}` - Actualizar video (propietario)
- `DELETE /api/course-videos/{videoId}` - Eliminar video (propietario)
- `PUT /api/course-videos/course/{courseId}/reorder` - Reordenar videos (propietario)
- `GET /api/course-videos/course/{courseId}/can-manage` - Verificar permisos de gestión

#### INSTRUCTOR (propio) y ADMIN
- `GET /api/courses/instructor/{instructorId}` - Cursos por instructor

#### Solo STUDENT
- `POST /api/enrollments` - Inscribirse en un curso
- `GET /api/enrollments/my-courses` - Mis cursos activos
- `GET /api/enrollments/my-courses/all` - Historial completo de inscripciones
- `GET /api/enrollments/my-courses/completed` - Mis cursos completados
- `GET /api/enrollments/check/{courseId}` - Verificar estado de inscripción
- `PUT /api/enrollments/{id}/progress` - Actualizar progreso (propio)
- `PUT /api/enrollments/{id}/complete` - Marcar como completado (propio)
- `DELETE /api/enrollments/{id}` - Desinscribirse de un curso (propio)

#### Todos los usuarios autenticados (STUDENT, INSTRUCTOR, ADMIN)
- `GET /api/users/profile` - Obtener perfil propio
- `PUT /api/users/profile` - Actualizar perfil propio
- `GET /api/enrollments/{id}` - Obtener inscripción por ID
- `GET /api/course-videos/course/{courseId}` - Videos de curso (con autenticación)
- `GET /api/course-videos/{videoId}` - Detalle de video (con autenticación)
- Cualquier endpoint no listado específicamente como público

## 📊 Monitoreo y Logging

### Health Check
**Endpoint:** `GET /actuator/health`  
**Descripción:** Verifica el estado del servidor  
**Acceso:** Público  

#### Response:
```json
{
  "status": "UP"
}
```

### Logs Disponibles
- **Login attempts:** Intentos de autenticación
- **Token validation:** Validación de tokens
- **Security events:** Eventos de seguridad
- **Error tracking:** Seguimiento de errores

## 🚀 Despliegue

### Entornos
- **Desarrollo:** H2 Database, CORS abierto
- **Producción:** MySQL Database, CORS restringido

### Variables de Producción
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:mysql://host:port/database
SPRING_DATASOURCE_USERNAME=username
SPRING_DATASOURCE_PASSWORD=password

# JWT
JWT_SECRET_KEY=production-secret-key-256-bits
JWT_EXPIRATION_TIME=86400000

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com
```

---

*Documentación de API actualizada: Septiembre 2025*  
*Versión: 1.0*  
*Backend: Java 21 + Spring Boot 3.x*  
*Mantenida por: E-Learning Platform Team*
