# 🌐 Landing Pages del Frontend

## 📋 Total de Páginas a Desarrollar: **12 páginas principales**

### **🏠 PÁGINAS PÚBLICAS (3)**

#### **1. Landing Page Principal (`/`)**
- **Propósito:** Página de bienvenida y marketing
- **Contenido:**
  - Hero section con call-to-action
  - Cursos destacados (carousel)
  - Testimonios/beneficios
  - Footer con enlaces importantes
- **Usuarios:** Todos (no autenticados)

#### **2. Catálogo de Cursos (`/courses`)**
- **Propósito:** Mostrar todos los cursos disponibles
- **Contenido:**
  - Grid de cards de cursos
  - Filtros básicos (categoría, instructor)
  - Búsqueda por título
  - Paginación
- **Usuarios:** Todos

#### **3. Detalle de Curso (`/courses/:id`)**
- **Propósito:** Información completa del curso
- **Contenido:**
  - Información del curso
  - Lista de videos (preview)
  - Información del instructor
  - Botón de inscripción/acceso
- **Usuarios:** Todos (contenido limitado si no inscrito)

---

### **🔐 PÁGINAS DE AUTENTICACIÓN (2)**

#### **4. Login (`/login`)**
- **Propósito:** Iniciar sesión
- **Contenido:**
  - Formulario email/password
  - Link a registro
  - Validaciones en tiempo real
- **Usuarios:** No autenticados

#### **5. Registro (`/register`)**
- **Propósito:** Crear cuenta nueva
- **Contenido:**
  - Formulario completo de registro
  - Selección de rol (estudiante/instructor)
  - Términos y condiciones
- **Usuarios:** No autenticados

---

### **👨‍🎓 ÁREA DEL ESTUDIANTE (3)**

#### **6. Dashboard Estudiante (`/dashboard`)**
- **Propósito:** Panel principal del estudiante
- **Contenido:**
  - Mis cursos inscritos
  - Progreso general
  - Cursos recomendados
  - Actividad reciente
- **Usuarios:** Solo estudiantes autenticados

#### **7. Mis Cursos (`/my-courses`)**
- **Propósito:** Listado detallado de cursos inscritos
- **Contenido:**
  - Grid de cursos inscritos
  - Progreso por curso
  - Links a contenido
  - Botón desinscribirse
- **Usuarios:** Solo estudiantes

#### **8. Visor de Curso (`/courses/:id/learn`)**
- **Propósito:** Consumir contenido del curso
- **Contenido:**
  - Player de video YouTube embebido
  - Lista de videos del curso
  - Marcador de progreso
  - Navegación entre videos
- **Usuarios:** Solo estudiantes inscritos

---

### **👨‍🏫 ÁREA DEL INSTRUCTOR (3)**

#### **9. Dashboard Instructor (`/instructor/dashboard`)**
- **Propósito:** Panel principal del instructor
- **Contenido:**
  - Mis cursos creados
  - Estadísticas de inscripciones
  - Earnings (si aplica pagos)
  - Acciones rápidas
- **Usuarios:** Solo instructores autenticados

#### **10. Gestión de Cursos (`/instructor/courses`)**
- **Propósito:** CRUD de cursos del instructor
- **Contenido:**
  - Lista de cursos propios
  - Botones crear/editar/eliminar
  - Estados (borrador/publicado)
  - Filtros por estado
- **Usuarios:** Solo instructores

#### **11. Crear/Editar Curso (`/instructor/courses/new` y `/instructor/courses/:id/edit`)**
- **Propósito:** Formulario de curso
- **Contenido:**
  - Formulario completo de curso
  - Gestión de videos YouTube
  - Preview del curso
  - Botones guardar/publicar
- **Usuarios:** Solo instructores (owner o admin)

---

### **👨‍💼 ÁREA ADMINISTRATIVA (1)**

#### **12. Panel Admin (`/admin`)**
- **Propósito:** Gestión general de la plataforma
- **Contenido:**
  - Estadísticas generales
  - Gestión de usuarios
  - Gestión de todos los cursos
  - Reportes básicos
- **Usuarios:** Solo administradores

---

## 🎨 Componentes Reutilizables (Adicionales)

### **Componentes Principales:**
- **CourseCard:** Tarjeta de curso para grids
- **VideoPlayer:** Player YouTube embebido
- **ProgressBar:** Barra de progreso
- **UserMenu:** Menú desplegable de usuario
- **Navigation:** Barra de navegación responsive
- **Footer:** Pie de página con enlaces
- **LoadingSpinner:** Indicador de carga
- **ErrorBoundary:** Manejo de errores
- **ProtectedRoute:** Rutas protegidas por rol
- **NotFound (404):** Página de error

### **Responsive Breakpoints:**
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** 1024px+

---
