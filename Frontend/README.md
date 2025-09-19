# EduPlataform - Frontend

## 📚 Descripción

EduPlataform es una plataforma de e-learning moderna construida con React que permite a estudiantes, instructores y administradores gestionar cursos, contenido educativo y experiencias de aprendizaje interactivas.

## 🚀 Características Principales

### Para Estudiantes

- **Dashboard personalizado** con estadísticas de progreso
- **Catálogo de cursos** con filtros y búsqueda avanzada
- **Reproductor de video** integrado para contenido multimedia
- **Seguimiento de progreso** en tiempo real
- **Sistema de pagos** seguro con Stripe
- **Perfil personalizable** con historial de actividades

### Para Instructores

- **Panel de control** con métricas detalladas
- **Creador de cursos** con editor visual
- **Gestión de estudiantes** y mensajería
- **Analytics avanzados** de rendimiento
- **Sistema de subida** de videos y materiales
- **Configuración de precios** y promociones

### Para Administradores

- **Panel administrativo** completo
- **Gestión de usuarios** y roles
- **Moderación de contenido**
- **Reportes y estadísticas** del sistema
- **Configuración global** de la plataforma

## 🛠️ Tecnologías Utilizadas

### Core Framework

- **React 18.2.0** - Biblioteca principal de UI
- **Vite 6.3.5** - Herramienta de build y desarrollo
- **React Router DOM 7.8.2** - Enrutamiento del lado del cliente

### UI y Estilos

- **Tailwind CSS 3.4.17** - Framework de CSS utilitario
- **Material-UI 7.3.2** - Componentes de interfaz
- **Radix UI** - Componentes primitivos accesibles
- **Lucide React** - Iconografía moderna
- **Heroicons** - Iconos SVG optimizados

### Estado y Datos

- **TanStack Query 5.87.4** - Gestión de estado del servidor
- **React Hook Form 7.62.0** - Manejo de formularios
- **Yup 1.7.0** - Validación de esquemas

### Visualización y Multimedia

- **Chart.js 4.5.0** - Gráficos y visualizaciones
- **Recharts 3.1.2** - Componentes de gráficos
- **React Player 3.3.2** - Reproductor multimedia

### Utilidades

- **Axios 1.11.0** - Cliente HTTP
- **Date-fns 4.1.0** - Manipulación de fechas
- **React Toastify 11.0.5** - Notificaciones
- **Sonner 2.0.7** - Sistema de notificaciones

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── config/             # Configuraciones de la aplicación
├── contexts/           # Contextos de React (Auth, Sidebar, etc.)
├── core/              # Lógica de negocio central
│   ├── auth/          # Repositorios y servicios de autenticación
│   ├── course/        # Entidades y lógica de cursos
│   └── user/          # Gestión de usuarios
├── features/          # Funcionalidades por módulos
│   ├── admin/         # Panel de administración
│   ├── auth/          # Autenticación y registro
│   ├── course/        # Gestión de cursos
│   ├── marketing/     # Páginas de marketing
│   ├── payment/       # Procesamiento de pagos
│   ├── student/       # Dashboard de estudiantes
│   └── teacher/       # Panel de instructores
├── interfaces/        # Interfaces y tipos
├── layouts/           # Layouts de la aplicación
├── pages/             # Páginas principales
├── routes/            # Configuración de rutas
├── services/          # Servicios de API
├── shared/            # Componentes y utilidades compartidas
├── ui/                # Componentes de interfaz base
└── utils/             # Utilidades generales
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recomendado) o npm >= 8.0.0

### Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd E-Learning-Platform/Frontend
```

2. **Instalar dependencias**

```bash
# Con pnpm (recomendado)
pnpm install

# O con npm
npm install
```

3. **Configurar variables de entorno**

```bash
# Crear archivo .env.local
cp .env.example .env.local
```

Configurar las siguientes variables:

```env
VITE_API_URL=http://localhost:8080
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_APP_NAME=EduPlataform
```

4. **Ejecutar en modo desarrollo**

```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo
pnpm build            # Construye para producción
pnpm preview          # Vista previa de la build
pnpm lint             # Ejecuta ESLint

# Análisis
pnpm build --mode analyze  # Genera reporte de análisis del bundle
```

## 🏗️ Arquitectura

### Patrón de Diseño

- **Feature-Based Architecture**: Organización por funcionalidades
- **Context API**: Gestión de estado global
- **Custom Hooks**: Lógica reutilizable
- **Service Layer**: Abstracción de APIs

### Flujo de Datos

1. **Componentes** consumen datos vía hooks personalizados
2. **Servicios** manejan la comunicación con APIs
3. **Contextos** proporcionan estado global
4. **TanStack Query** cachea y sincroniza datos del servidor

### Rutas y Navegación

- **Rutas Públicas**: Marketing, autenticación
- **Rutas Privadas**: Dashboard de estudiantes
- **Rutas de Instructor**: Panel de enseñanza
- **Rutas de Admin**: Panel administrativo

## 🎨 Sistema de Diseño

### Colores

El sistema utiliza variables CSS personalizadas que se mapean a Tailwind:

```css
/* Colores primarios */
--color-primary-500: #ef4444;
--color-primary-900: #7f1d1d;

/* Colores secundarios */
--color-secondary-500: #6366f1;
--color-secondary-900: #312e81;

/* Colores neutros */
--color-neutral-50: #fafafa;
--color-neutral-900: #171717;
```

### Tipografía

- **Fuente principal**: Inter (sans-serif)
- **Sistema de escalas**: Basado en Tailwind CSS

### Componentes

- **Design System**: Componentes base en `/ui`
- **Shared Components**: Componentes reutilizables en `/shared`
- **Feature Components**: Componentes específicos por funcionalidad

## 🔧 Configuración Avanzada

### Vite Configuration

- **Proxy de desarrollo** para APIs
- **Code splitting** automático
- **Tree shaking** optimizado
- **Bundle analyzer** integrado

### Tailwind Configuration

- **Variables CSS** personalizadas
- **Dark mode** habilitado
- **Plugins** adicionales configurados

### ESLint Configuration

- **Reglas de React** habilitadas
- **Hooks** validados
- **Refresh** automático

## 📱 Responsive Design

La aplicación está optimizada para:

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🔐 Autenticación y Seguridad

### Sistema de Roles

- **STUDENT**: Acceso a cursos y dashboard
- **TEACHER**: Creación y gestión de cursos
- **ADMIN**: Administración completa del sistema

### Protección de Rutas

- **Guards** implementados para rutas protegidas
- **Validación de tokens** automática
- **Redirección** basada en roles

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Build Manual

```bash
pnpm build
# Los archivos se generan en /dist
```

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
pnpm test
```

## 📊 Performance

### Optimizaciones Implementadas

- **Lazy loading** de componentes
- **Code splitting** por rutas
- **Image optimization** automática
- **Bundle analysis** disponible

### Métricas

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🔄 Changelog

### v1.0.0

- ✅ Implementación inicial
- ✅ Sistema de autenticación completo
- ✅ Dashboard de estudiantes e instructores
- ✅ Panel administrativo
- ✅ Sistema de pagos con Stripe
- ✅ Reproductor de video integrado
- ✅ Responsive design

---

**Desarrollado con ❤️ para la Hackathon Tech Advanced - Oracle Next Education (ONE)**
