# Documentación de Autenticación JWT - E-Learning Platform

## 📋 Descripción General

Este documento describe la implementación completa del sistema de autenticación JWT para la plataforma E-Learning. El sistema utiliza **Spring Boot Security** con **tokens JWT** para autenticación stateless, siguiendo principios **SOLID** y **Clean Architecture**.

## 🏗️ Arquitectura de Autenticación

### Componentes Principales

```
Backend/src/main/java/com/Dev_learning_Platform/Dev_learning_Platform/
├── config/
│   └── Securityconfig.java           # Configuración principal de Spring Security
├── controllers/
│   └── AuthController.java           # Endpoints de autenticación
├── dtos/
│   ├── LoginRequestDto.java          # Request para login
│   ├── LoginResponseDto.java         # Response de login exitoso
│   ├── AuthErrorResponseDto.java     # Response de errores
│   └── TokenValidationResponseDto.java # Response de validación de token
├── middlewares/
│   └── JwtAuthenticationFilter.java  # Filtro para validar tokens JWT
├── services/
│   ├── CustomUserDetailsService.java # Integración con Spring Security
│   └── auth/
│       ├── JwtService.java           # Facade principal JWT
│       ├── JwtTokenGenerator.java    # Generación de tokens
│       ├── JwtTokenValidator.java    # Validación de tokens
│       └── JwtClaimsExtractor.java   # Extracción de claims
└── models/
    └── User.java                     # Entidad de usuario
```

## 🔐 Flujo de Autenticación

### 1. Proceso de Login
```
1. Cliente envía credenciales → POST /auth/login
2. AuthController valida formato (Bean Validation)
3. Spring Security autentica credenciales
4. CustomUserDetailsService verifica usuario activo
5. JwtService genera token JWT
6. Retorna LoginResponseDto con token
```

### 2. Validación de Token en Requests Protegidos
```
1. Cliente envía request con header: Authorization: Bearer <token>
2. JwtAuthenticationFilter intercepta request
3. Extrae y valida token JWT
4. Carga usuario en SecurityContext
5. Permite acceso al endpoint protegido
```

## 🛠️ Componentes Detallados

### **AuthController** - Endpoints de Autenticación
**Ubicación:** `controllers/AuthController.java`

**Responsabilidades:**
- Manejo de requests de autenticación
- Validación de credenciales
- Generación y retorno de tokens JWT
- Gestión de errores específicos de autenticación

**Principios SOLID aplicados:**
- **SRP:** Solo maneja autenticación
- **OCP:** Extensible para OAuth, 2FA
- **DIP:** Inyección de dependencias

### **JwtService** - Facade de Servicios JWT
**Ubicación:** `services/auth/JwtService.java`

**Responsabilidades:**
- Orquesta componentes JWT especializados
- Proporciona interfaz unificada para JWT
- Mantiene separación de responsabilidades

**Componentes:**
- **JwtTokenGenerator:** Solo generación de tokens
- **JwtTokenValidator:** Solo validación de tokens
- **JwtClaimsExtractor:** Solo extracción de claims

### **JwtAuthenticationFilter** - Middleware JWT
**Ubicación:** `middlewares/JwtAuthenticationFilter.java`

**Responsabilidades:**
- Intercepta requests HTTP
- Extrae tokens del header Authorization
- Valida tokens y establece contexto de seguridad
- Permite acceso a endpoints protegidos

**Flujo de ejecución:**
1. Verifica header `Authorization: Bearer <token>`
2. Extrae token del header
3. Valida token usando `JwtService`
4. Carga usuario usando `CustomUserDetailsService`
5. Establece autenticación en `SecurityContext`

### **CustomUserDetailsService** - Integración Spring Security
**Ubicación:** `services/CustomUserDetailsService.java`

**Responsabilidades:**
- Implementa `UserDetailsService` de Spring Security
- Carga usuarios desde base de datos
- Convierte entidad `User` a `UserDetails`
- Valida estado activo del usuario

### **SecurityConfig** - Configuración Principal
**Ubicación:** `config/Securityconfig.java`

**Configuraciones:**
- **Endpoints públicos:** `/auth/**`, `/api/users/register`
- **Endpoints protegidos:** Todo lo demás requiere JWT
- **CORS:** Habilitado para frontend React
- **Session:** Stateless (sin sesiones)
- **CSRF:** Deshabilitado (JWT es inmune)

## 🔧 Configuración de Entorno

### Variables de Entorno (.env)
```properties
JWT_SECRET_KEY=4c6fb40397598dd8c1dbb3155fba3ca208a16fe8d5d90162b74f1874a4dc12b6
JWT_EXPIRATION_TIME=86400000  # 24 horas en milisegundos
```

### Base de Datos de Desarrollo (H2)
```properties
spring.h2.console.enabled=true
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password
```

## 🗂️ Modelo de Datos

### Entidad User
```java
@Entity
@Table(name = "users")
public class User {
    private Long id;
    private String userName;      // Nombre del usuario
    private String lastName;      // Apellido del usuario
    private String email;         // Email único (usado como username)
    private String password;      // Contraseña hasheada con BCrypt
    private Role role;           // STUDENT, INSTRUCTOR, ADMIN
    private boolean isActive;     // Estado activo/inactivo
    private Timestamp createdAt;  // Fecha de creación
    private Timestamp updatedAt;  // Fecha de actualización
}

public enum Role {
    STUDENT,    // Estudiante
    INSTRUCTOR, // Instructor de cursos
    ADMIN       // Administrador del sistema
}
```

## 🔒 Seguridad Implementada

### Validaciones de Entrada
- **Email:** Formato válido, máximo 100 caracteres
- **Password:** Mínimo 6 caracteres, máximo 100 caracteres
- **Bean Validation:** Validación automática en DTOs

### Encriptación
- **BCrypt:** Encriptación de contraseñas
- **HMAC-SHA256:** Firma de tokens JWT
- **Secret Key:** 256 bits de longitud

### Manejo de Excepciones
- **BadCredentialsException:** Credenciales incorrectas
- **DisabledException:** Usuario inactivo
- **JwtException:** Errores de token JWT
- **UsernameNotFoundException:** Usuario no encontrado

### Logging de Seguridad
- **Intentos de login** (exitosos y fallidos)
- **Validación de tokens**
- **Errores de autenticación**
- **Accesos a endpoints protegidos**

## 🎯 Características de MVP

### Funcionalidades Implementadas
✅ **Generación de tokens JWT**
✅ **Validación de tokens en endpoints protegidos**
✅ **Endpoint de login con credenciales**
✅ **Endpoint de validación de token**
✅ **Middleware de autenticación automática**
✅ **Manejo de errores específicos**
✅ **Logging estructurado**
✅ **CORS habilitado para frontend**

### Limitaciones del MVP
- No implementa refresh tokens
- No implementa rate limiting
- No implementa blacklist de tokens
- No implementa 2FA (autenticación de dos factores)
- No implementa recuperación de contraseña

## 🔄 Estados de Usuario

### Estados Posibles
- **Activo (`isActive = true`):** Usuario puede autenticarse
- **Inactivo (`isActive = false`):** Usuario bloqueado, no puede autenticarse

### Roles y Permisos
- **STUDENT:** Acceso a cursos y contenido educativo
- **INSTRUCTOR:** Crear y gestionar cursos
- **ADMIN:** Administración completa del sistema

## 📈 Métricas y Monitoreo

### Logs Implementados
- **INFO:** Login exitoso
- **WARN:** Credenciales inválidas, tokens expirados
- **ERROR:** Errores internos del servidor
- **DEBUG:** Validación de tokens, carga de usuarios

### Health Check
- **Endpoint:** `/actuator/health` (público)
- **Uso:** Monitoreo de estado del servidor

## 🔧 Mantenimiento

### Rotación de Secret Key
1. Generar nueva clave: `openssl rand -hex 32`
2. Actualizar variable `JWT_SECRET_KEY`
3. Reiniciar aplicación
4. Los tokens existentes quedarán inválidos

### Actualización de Tiempo de Expiración
- Modificar `JWT_EXPIRATION_TIME` en milisegundos
- Reiniciar aplicación
- Solo afecta tokens nuevos

## 🧪 Testing de Seguridad

### Casos de Prueba Recomendados
1. **Login con credenciales válidas**
2. **Login con credenciales inválidas**
3. **Acceso a endpoint protegido con token válido**
4. **Acceso a endpoint protegido sin token**
5. **Acceso a endpoint protegido con token expirado**
6. **Validación de token válido/inválido**

### Herramientas de Testing
- **Postman:** Para testing manual de API
- **JUnit:** Para unit tests
- **MockMvc:** Para integration tests
- **TestContainers:** Para testing con base de datos real

## 📚 Referencias Técnicas

### Tecnologías Utilizadas
- **Java 21**
- **Spring Boot 3.x**
- **Spring Security 6.x**
- **JWT (JSON Web Tokens)**
- **BCrypt**
- **H2 Database** (desarrollo)
- **MySQL** (producción)

### Patrones de Diseño Aplicados
- **Facade Pattern:** JwtService
- **Factory Pattern:** DTOs con factory methods
- **Filter Pattern:** JwtAuthenticationFilter
- **Repository Pattern:** UserRepository
- **Service Layer Pattern:** Servicios de negocio

---

*Documentación actualizada: Septiembre 2025*
*Versión: 1.0*
*Mantenida por: E-Learning Platform Team*
