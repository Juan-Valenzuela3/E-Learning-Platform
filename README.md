# 🎓 Plataforma de E-Learning - Backend

## 📋 Descripción del Proyecto
Esta es una plataforma de e-learning desarrollada con Spring Boot que proporciona un sistema completo de gestión de cursos, usuarios y autenticación. El proyecto implementa las mejores prácticas de seguridad, incluyendo autenticación JWT con refresh tokens, roles de usuario y auditoría completa.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación y Autorización
- **Autenticación JWT** con tokens de acceso y renovación
- **Refresh Tokens** con expiración extendida y rotación automática
- **Roles de Usuario** (STUDENT, INSTRUCTOR, ADMIN)
- **Middleware de Seguridad** con filtros personalizados
- **Auditoría Completa** de sesiones y accesos

### 👥 Gestión de Usuarios
- **Registro y login** de usuarios
- **Perfiles de usuario** con información personal
- **Gestión de roles** y permisos
- **Control de estado** activo/inactivo
- **Encriptación de contraseñas** con BCrypt
- **Funciones de administrador**: listar, eliminar usuarios y cambiar roles

### 📚 Sistema de Gestión de Cursos
- **Creación de cursos** por instructores
- **Gestión de cursos** con título, descripción y estado
- **Asignación de instructores** a cursos
- **Control de acceso** basado en roles
- **Listado de cursos** activos e inactivos

### 🔄 Sistema de Tokens
- **Access Tokens JWT** (1 hora de duración)
- **Refresh Tokens** (7 días de duración)
- **Rotación Automática** de tokens antiguos
- **Revocación Individual y Masiva** de tokens
- **Límite de Tokens Activos** por usuario (5 por defecto)

### 📊 Monitoreo y Auditoría
- **Logging Detallado** de todas las requests
- **Middleware de Auditoría** con información de IP y User-Agent
- **Estadísticas de Tokens** por usuario
- **Limpieza Automática** de tokens expirados

## 🛠️ Tecnologías Utilizadas

### Backend
- **Spring Boot 3.5.5** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - Persistencia de datos
- **JWT (JSON Web Tokens)** - Autenticación stateless
- **BCrypt** - Encriptación de contraseñas
- **H2 Database** - Base de datos en memoria (desarrollo)
- **MySQL** - Base de datos de producción
- **Lombok** - Reducción de código boilerplate

### Herramientas de Desarrollo
- **Maven** - Gestión de dependencias
- **Git** - Control de versiones
- **HTTPie/cURL** - Pruebas de API
- **H2 Console** - Interfaz de base de datos

## 📁 Estructura del Proyecto

```
Backend/Dev-learning-Platform/
├── src/main/java/com/Dev_learning_Platform/Dev_learning_Platform/
│   ├── config/                    # Configuración de seguridad
│   │   ├── SecurityConfig.java
│   │   └── DataInitializer.java
│   ├── controllers/               # Controladores REST
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── CourseController.java
│   │   ├── RefreshTokenController.java
│   │   ├── PublicController.java
│   │   ├── ProtectedController.java
│   │   └── JwtTestController.java
│   ├── dtos/                      # Objetos de transferencia de datos
│   │   ├── AuthResponseDto.java
│   │   ├── LoginRequestDto.java
│   │   ├── UserRegisterDto.java
│   │   ├── CourseCreateDto.java
│   │   ├── TokenRefreshRequestDto.java
│   │   └── TokenRefreshResponseDto.java
│   ├── middleware/                # Middleware personalizado
│   │   └── RequestLoggingMiddleware.java
│   ├── middlewares/               # Middleware base
│   │   └── Middleware.java
│   ├── models/                    # Entidades de base de datos
│   │   ├── User.java
│   │   ├── Course.java
│   │   └── RefreshToken.java
│   ├── repositories/              # Repositorios de datos
│   │   ├── UserRepository.java
│   │   └── CourseRepository.java
│   ├── routes/                    # Configuración de rutas
│   │   └── Route.java
│   ├── security/                  # Componentes de seguridad
│   │   ├── JwtTokenProvider.java
│   │   └── JwtAuthenticationFilter.java
│   ├── services/                  # Lógica de negocio
│   │   ├── UserService.java
│   │   ├── CourseService.java
│   │   ├── RefreshTokenService.java
│   │   └── CustomUserDetailsService.java
│   └── DevLearningPlatformApplication.java
├── src/main/resources/
│   └── application.properties
├── src/test/java/
│   └── DevLearningPlatformApplicationTests.java
├── pom.xml
└── test_basic_system.sh
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Java 17 o superior
- Maven 3.6+
- MySQL (opcional, para producción)

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd E-Learning-Platform/Backend/Dev-learning-Platform
```

### 2. Configurar Base de Datos
El proyecto está configurado para usar H2 Database en desarrollo por defecto. Para usar MySQL:

- Editar `src/main/resources/application.properties`
- Descomentar las líneas de MySQL
- Configurar credenciales de base de datos

### 3. Ejecutar la Aplicación
```bash
# Compilar el proyecto
mvn clean compile

# Ejecutar la aplicación
mvn spring-boot:run

# O ejecutar el JAR
mvn clean package
java -jar target/Dev-learning-Platform-0.0.1-SNAPSHOT.jar
```

### 4. Verificar la Instalación
- **Aplicación**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
- **Endpoint público**: http://localhost:8080/api/public/hello

## 📚 Documentación de la API

### Endpoints Públicos
- `GET  /api/public/hello`          # Saludo público
- `GET  /api/public/info`           # Información de la plataforma
- `POST /api/auth/register`         # Registro de usuarios
- `POST /api/auth/login`            # Login de usuarios
- `GET  /api/auth/test`             # Prueba de conectividad
- `POST /api/auth/validate`         # Validación de tokens

### Endpoints de Autenticación
- `POST /api/auth/refresh`          # Renovar access token
- `POST /api/auth/logout`           # Logout individual
- `POST /api/auth/logout-all`       # Logout masivo

### Endpoints de Gestión de Usuarios
- `GET  /api/users/me`              # Información del usuario actual
- `GET  /api/users/profile`         # Perfil del usuario
- `GET  /api/users/all`             # Listar todos los usuarios (ADMIN)
- `DELETE /api/users/{userId}`      # Eliminar usuario (ADMIN)
- `PUT  /api/users/{userId}/role`   # Cambiar rol de usuario (ADMIN)

### Endpoints de Gestión de Cursos
- `POST /api/courses/create`        # Crear curso (INSTRUCTOR/ADMIN)
- `GET  /api/courses/my-courses`    # Mis cursos (INSTRUCTOR)
- `GET  /api/courses/all-active`    # Todos los cursos activos

### Endpoints de Gestión de Tokens
- `GET  /api/refresh-tokens/my-tokens`           # Ver tokens activos
- `DELETE /api/refresh-tokens/revoke/{tokenId}`  # Revocar token específico
- `DELETE /api/refresh-tokens/revoke-all`        # Revocar todos los tokens
- `GET  /api/refresh-tokens/stats`               # Estadísticas de tokens

### Endpoints Protegidos
- `GET  /api/protected/profile`     # Perfil protegido
- `GET  /api/protected/dashboard`   # Dashboard protegido
- `POST /api/protected/update`      # Actualizar perfil

### Endpoints de Pruebas JWT
- `GET  /api/jwt-test/info`         # Información detallada del token
- `GET  /api/jwt-test/protected-data`  # Datos protegidos
- `POST /api/jwt-test/refresh-token`   # Renovar token de prueba

## 🧪 Pruebas de la API

### Scripts de Prueba Disponibles
- `test_basic_system.sh` - Pruebas completas del sistema básico

### Ejemplo de Flujo de Autenticación

#### 1. Registrar usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"Test","lastName":"User","email":"test@example.com","password":"123456"}'
```

#### 2. Login y obtener tokens
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

#### 3. Usar access token
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI"
```

#### 4. Crear curso (como instructor)
```bash
curl -X POST http://localhost:8080/api/courses/create \
  -H "Authorization: Bearer TU_TOKEN_JWT_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"title":"Curso de Java","description":"Aprende Java desde cero"}'
```

## 🔧 Configuración

### Variables de Entorno Importantes
```properties
# JWT Configuration
jwt.secret=tuClaveSecretaMuyLargaYSeguraParaJWTEnProduccionCambiarla
jwt.expiration=3600000                    # 1 hora en milisegundos
jwt.refresh-expiration=604800000          # 7 días en milisegundos
jwt.max-refresh-tokens-per-user=5         # Máximo tokens por usuario

# Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb  # H2 para desarrollo
spring.jpa.hibernate.ddl-auto=update      # Actualizar esquema automáticamente
```

### Configuración de Seguridad
- **CSRF**: Deshabilitado para APIs REST
- **CORS**: Configurado para desarrollo (permitir todas las origenes)
- **Sesiones**: Stateless (sin estado)
- **Headers de Seguridad**: Configurados automáticamente

## 📊 Monitoreo y Logs

### Logging Configurado
- **Nivel**: DEBUG para desarrollo
- **Formato**: Timestamp + mensaje
- **Middleware**: Logging automático de todas las requests
- **Filtrado**: Headers sensibles excluidos automáticamente

### Información Loggeada
- Timestamp de cada request
- Método HTTP y URI
- IP del cliente
- User-Agent
- Headers (excluyendo información sensible)
- Tiempo de respuesta
- Body de responses JSON

## 🔒 Seguridad

### Medidas de Seguridad Implementadas
✅ Encriptación BCrypt para contraseñas
✅ Tokens JWT firmados con HMAC-SHA512
✅ Refresh tokens con expiración extendida
✅ Rotación automática de tokens antiguos
✅ Revocación de tokens individual y masiva
✅ Límites de tokens por usuario
✅ Auditoría completa de sesiones
✅ Filtrado de información sensible en logs
✅ Validación robusta de tokens
✅ Manejo seguro de errores
✅ Control de acceso basado en roles (RBAC)
✅ Inicialización automática de usuario admin

### Recomendaciones de Seguridad
- Cambiar `jwt.secret` en producción
- Configurar HTTPS en producción
- Limitar orígenes CORS en producción
- Configurar rate limiting
- Implementar blacklist de tokens
- Agregar validación de contraseñas robusta

## 🚀 Despliegue

### Desarrollo Local
```bash
mvn spring-boot:run
```

### Producción
```bash
# Compilar JAR
mvn clean package

# Ejecutar en producción
java -jar target/Dev-learning-Platform-0.0.1-SNAPSHOT.jar \
  --spring.profiles.active=production
```

### Docker (Opcional)
```dockerfile
FROM openjdk:17-jdk-slim
COPY target/Dev-learning-Platform-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

## 📝 Próximos Pasos

### Funcionalidades Planificadas
- [ ] **Sistema de Inscripciones** - Inscripción a cursos
- [ ] **Contenido Multimedia** - Videos, PDFs, etc.
- [ ] **Seguimiento de Progreso** - Tracking de avance
- [ ] **Evaluaciones** - Sistema de exámenes
- [ ] **Notificaciones** - Sistema de alertas
- [ ] **Pasarela de Pagos** - Integración de pagos
- [ ] **Documentación Swagger** - API documentada

### Mejoras Técnicas
- [ ] **Rate Limiting** - Limitar requests por IP
- [ ] **Caché Redis** - Mejorar rendimiento
- [ ] **Métricas Prometheus** - Monitoreo avanzado
- [ ] **Tests Unitarios** - Cobertura completa
- [ ] **CI/CD Pipeline** - Automatización de deploy

## 🤝 Contribución

### Cómo Contribuir
1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

### Estándares de Código
- Comentarios en español para consistencia
- JavaDoc completo para todas las clases públicas
- Nombres descriptivos para variables y métodos
- Manejo de errores robusto
- Logging apropiado para debugging

## 👥 Autores

**Equipo 7 No Country** - Desarrollo inicial
- **Juan Valenzuela** - Líder del proyecto y repositorio principal
- **Santiago Restrepo** - Implementación de sistema de autenticación y gestión de cursos

## 🙏 Agradecimientos

- **Spring Boot Team** - Por el excelente framework
- **Spring Security Team** - Por las herramientas de seguridad
- **Comunidad JWT** - Por las librerías de tokens
- **NoCountry** - Por la oportunidad de desarrollo

---

*Este README se actualiza regularmente. Última actualización: Diciembre 2024*
