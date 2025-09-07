# 📋 Product Backlog - E-learning Platform MVP

## 🎯 Product Backlog (Orden de Prioridad)

### 🔴 **PRIORIDAD CRÍTICA (Must Have)**

| ID | Historia de Usuario | Rol | Estimación | Dependencias |
|----|-------------------|-----|------------|--------------|
| PB-001 | Como usuario quiero registrarme en la plataforma | Backend | 3 puntos | - |
| PB-002 | Como usuario quiero iniciar sesión con JWT | Backend | 5 puntos | PB-001 |
| PB-003 | Como sistema necesito diferenciar roles (estudiante/instructor/admin) | Backend | 2 puntos | PB-002 |
| PB-004 | Como usuario quiero ver mi perfil y editarlo | Backend/Frontend | 3 puntos | PB-003 |
| PB-005 | Como visitante quiero ver el catálogo de cursos públicos | Backend/Frontend | 4 puntos | - |
| PB-006 | Como instructor quiero crear un curso básico | Backend | 5 puntos | PB-003 |
| PB-007 | Como instructor quiero agregar videos de YouTube a mi curso | Backend | 4 puntos | PB-006 |
| PB-008 | Como estudiante quiero inscribirme a un curso | Backend | 5 puntos | PB-003, PB-006 |
| PB-009 | Como estudiante inscrito quiero ver el contenido del curso | Backend/Frontend | 6 puntos | PB-008 |
| PB-010 | Como usuario quiero navegar en una interfaz responsive | Frontend | 8 puntos | PB-004 |

### 🟡 **PRIORIDAD ALTA (Should Have)**

| ID | Historia de Usuario | Rol | Estimación | Dependencias |
|----|-------------------|-----|------------|--------------|
| PB-011 | Como estudiante quiero ver mis cursos inscritos | Frontend | 3 puntos | PB-008 |
| PB-012 | Como instructor quiero ver mis cursos creados | Frontend | 3 puntos | PB-006 |
| PB-013 | Como instructor quiero editar mis cursos | Backend | 4 puntos | PB-006 |
| PB-014 | Como estudiante quiero desinscribirme de un curso | Backend | 2 puntos | PB-008 |
| PB-015 | Como admin quiero ver estadísticas básicas de la plataforma | Backend | 5 puntos | PB-003 |

### 🟢 **PRIORIDAD MEDIA (Could Have)**

| ID | Historia de Usuario | Rol | Estimación | Dependencias |
|----|-------------------|-----|------------|--------------|
| PB-016 | Como estudiante quiero marcar videos como vistos | Backend | 4 puntos | PB-009 |
| PB-017 | Como usuario quiero ver mi progreso en el curso | Backend/Frontend | 6 puntos | PB-016 |
| PB-018 | Como instructor quiero ver quiénes están inscritos en mi curso | Backend | 3 puntos | PB-008 |
| PB-019 | Como admin quiero gestionar usuarios (activar/desactivar) | Backend | 4 puntos | PB-015 |

### 🔵 **PRIORIDAD BAJA (Won't Have en MVP)**

| ID | Historia de Usuario | Rol | Estimación | Dependencias |
|----|-------------------|-----|------------|--------------|
| PB-020 | Como estudiante quiero pagar por cursos premium | Backend | 8 puntos | PB-008 |
| PB-021 | Como usuario quiero recibir notificaciones | Backend | 6 puntos | PB-017 |
| PB-022 | Como instructor quiero crear evaluaciones | Backend | 10 puntos | PB-009 |
| PB-023 | Como estudiante quiero realizar evaluaciones | Backend/Frontend | 8 puntos | PB-022 |
| PB-024 | Como sistema quiero tener documentación Swagger completa | DevOps | 5 puntos | - |

---

# 🚀 Sprint Backlogs por Semana

## **Sprint 1 - Semana 1: Fundación del Sistema**
**Sprint Goal:** *Establecer la base funcional con autenticación y CRUD básico*

### 🎯 **Sprint Backlog - Semana 1**

#### **🔴 BACKEND (Tú)**
- **PB-001:** Como usuario quiero registrarme en la plataforma
  - [ ] Setup proyecto Spring Boot con dependencias
  - [ ] Configurar MySQL en OCI
  - [ ] Crear entidad User con validaciones
  - [ ] Endpoint POST /auth/register
  - [ ] Hash de contraseñas con BCrypt
  - [ ] Validaciones de email único

- **PB-002:** Como usuario quiero iniciar sesión con JWT
  - [ ] Configurar Spring Security
  - [ ] Implementar generación JWT
  - [ ] Endpoint POST /auth/login
  - [ ] Middleware de validación JWT
  - [ ] Manejo de refresh tokens

- **PB-003:** Como sistema necesito diferenciar roles
  - [ ] Enum de roles (STUDENT, INSTRUCTOR, ADMIN)
  - [ ] Anotaciones de seguridad por rol
  - [ ] Filtros de autorización

- **PB-006:** Como instructor quiero crear un curso básico
  - [ ] Crear entidad Course
  - [ ] Endpoint POST /api/courses (solo instructores)
  - [ ] Endpoint GET /api/courses (catálogo público)
  - [ ] Endpoint GET /api/courses/{id}
  - [ ] Validaciones de campos obligatorios

#### **🔵 FRONTEND**
- **PB-010:** Como usuario quiero navegar en una interfaz responsive
  - [ ] Setup React proyecto con Vite
  - [ ] Configurar React Router
  - [ ] Layout principal con navegación
  - [ ] Componentes de formulario reutilizables
  - [ ] Setup Tailwind CSS
  - [ ] Context para autenticación

- **PB-005:** Como visitante quiero ver el catálogo de cursos
  - [ ] Página landing/home
  - [ ] Componente Card de curso
  - [ ] Grid responsive de cursos
  - [ ] Mock data para desarrollo
  - [ ] Filtros básicos (opcional)

#### **🟡 DEVOPS (Tú)**
- **Infraestructura base**
  - [ ] Configurar repositorios GitHub
  - [ ] Setup GitHub Actions CI/CD
  - [ ] Configurar variables de entorno
  - [ ] Database MySQL en OCI
  - [ ] Documentación inicial README

**Criterios de Aceptación Semana 1:**
✅ Usuario puede registrarse e iniciar sesión  
✅ Instructores pueden crear cursos básicos  
✅ Catálogo público muestra cursos  
✅ Frontend responsive con navegación  
✅ Deploy en staging funcional  

---

## **Sprint 2 - Semana 2: Funcionalidades Core**
**Sprint Goal:** *Implementar inscripciones y contenido multimedia*

### 🎯 **Sprint Backlog - Semana 2**

#### **🔴 BACKEND (Tú)**
- **PB-008:** Como estudiante quiero inscribirme a un curso
  - [ ] Crear entidad Enrollment
  - [ ] Endpoint POST /api/enrollments
  - [ ] Validar no inscripción duplicada
  - [ ] Endpoint GET /api/enrollments/my-courses
  - [ ] Verificar rol de estudiante

- **PB-007:** Como instructor quiero agregar videos de YouTube
  - [ ] Campo youtube_urls JSON en Course
  - [ ] Endpoint POST /api/courses/{id}/videos
  - [ ] Validación URLs YouTube válidas
  - [ ] Endpoint DELETE /api/courses/{id}/videos/{index}
  - [ ] Autorización solo owner/admin

- **PB-009:** Como estudiante inscrito quiero ver contenido
  - [ ] Middleware verificar inscripción
  - [ ] Endpoint GET /api/courses/{id}/content
  - [ ] Serialización diferente por rol
  - [ ] Control acceso por inscripción

- **PB-004:** Como usuario quiero ver/editar mi perfil
  - [ ] Endpoint GET /api/users/profile
  - [ ] Endpoint PUT /api/users/profile
  - [ ] Validaciones de campos
  - [ ] Upload imagen perfil (opcional)

#### **🔵 FRONTEND**
- **PB-011:** Como estudiante quiero ver mis cursos inscritos
  - [ ] Página "Mis Cursos"
  - [ ] Integración con API inscripciones
  - [ ] Estados de carga y error
  - [ ] Links a contenido de cursos

- **PB-012:** Como instructor quiero ver mis cursos creados
  - [ ] Panel instructor
  - [ ] Lista de cursos propios
  - [ ] Botones de edición
  - [ ] Formulario agregar videos

- **Páginas de detalle**
  - [ ] Página detalle de curso
  - [ ] Botón inscripción (solo estudiantes)
  - [ ] Embed videos YouTube
  - [ ] Manejo permisos de acceso

#### **🟡 DEVOPS (Tú)**
- **Deploy y monitoreo**
  - [ ] Deploy backend OCI staging
  - [ ] Deploy frontend Vercel
  - [ ] Variables entorno producción
  - [ ] Logs básicos aplicación
  - [ ] Health check endpoints

**Criterios de Aceptación Semana 2:**
✅ Estudiantes pueden inscribirse a cursos  
✅ Instructores pueden agregar videos YouTube  
✅ Solo inscritos ven contenido completo  
✅ Panel funcional para cada tipo usuario  
✅ Deploy staging completo operativo  

---

## **Sprint 3 - Semana 3: Pulimiento y Testing**
**Sprint Goal:** *Completar funcionalidades MVP y preparar entrega*

### 🎯 **Sprint Backlog - Semana 3**

#### **🔴 BACKEND (Tú)**
- **PB-014:** Como estudiante quiero desinscribirme
  - [ ] Endpoint DELETE /api/enrollments/{courseId}
  - [ ] Validaciones de inscripción existente
  - [ ] Confirmación de eliminación

- **PB-013:** Como instructor quiero editar mis cursos
  - [ ] Endpoint PUT /api/courses/{id}
  - [ ] Validar ownership o admin
  - [ ] Endpoint DELETE /api/courses/{id}
  - [ ] Manejo de inscripciones existentes

- **PB-015:** Como admin quiero ver estadísticas (Si hay tiempo)
  - [ ] Endpoint GET /api/admin/stats
  - [ ] Total usuarios, cursos, inscripciones
  - [ ] Endpoint GET /api/admin/courses
  - [ ] Dashboard datos básicos

- **PB-016:** Como estudiante quiero marcar progreso (Si hay tiempo)
  - [ ] Entidad Progress básica
  - [ ] Endpoint PUT /api/courses/{id}/progress
  - [ ] Tracking videos vistos
  - [ ] Endpoint GET progreso

#### **🔵 FRONTEND**
- **Pulimiento UI/UX**
  - [ ] Mejorar diseño componentes
  - [ ] Añadir loading states
  - [ ] Mejorar manejo errores
  - [ ] Validaciones formularios
  - [ ] Responsive final testing

- **PB-018:** Como instructor quiero ver inscritos (Si hay tiempo)
  - [ ] Lista estudiantes por curso
  - [ ] Información básica estudiantes
  - [ ] Estadísticas inscripciones

#### **🟢 QA**
- **Testing completo**
  - [ ] Casos prueba críticos
  - [ ] Testing flujos completos
  - [ ] Pruebas cross-browser
  - [ ] Testing responsive
  - [ ] Reportar y verificar bugs

#### **🟡 DEVOPS (Tú)**
- **Preparación entrega**
  - [ ] Deploy producción final
  - [ ] Backup base datos
  - [ ] Monitoreo avanzado
  - [ ] Documentación deployment
  - [ ] Video demo preparado

**Criterios de Aceptación Semana 3:**
✅ Todas las funcionalidades críticas funcionan  
✅ UI/UX pulida y responsive  
✅ Deploy producción estable  
✅ Testing completo realizado  
✅ Demo preparada para presentación  

---

# 📊 **Métricas y Definition of Done**

## **Definition of Done por Historia:**
- [ ] Código desarrollado y revisado
- [ ] Pruebas unitarias (cuando aplique)
- [ ] API endpoints documentados
- [ ] Frontend integrado con backend
- [ ] Testing manual completado
- [ ] Deploy en staging funcional
