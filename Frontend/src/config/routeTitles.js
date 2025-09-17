/**
 * Mapeo de rutas a títulos de página
 * Las rutas deben coincidir exactamente con las definidas en el router
 */
export const routeTitles = {
  // Rutas públicas
  '/': 'Inicio',
  '/authentication': 'Iniciar sesión',
  '/authentication/register': 'Registro',
  '/authentication/forgot-password': 'Recuperar contraseña',
  '/authentication/reset-password': 'Restablecer contraseña',
  '/courses': 'Catálogo de cursos',
  '/courses/:id': 'Detalles del curso',
  '/about': 'Sobre nosotros',
  '/contact': 'Contacto',
  '/privacy': 'Política de privacidad',
  '/terms': 'Términos y condiciones',
  '/404': 'Página no encontrada',
  
  // Rutas de estudiante
  '/dashboard': 'Panel de control',
  '/mis-cursos': 'Mis cursos',
  '/mis-cursos/:id': 'Curso en progreso',
  '/perfil': 'Mi perfil',
  '/configuracion': 'Configuración',
  
  // Rutas de profesor
  '/instructor/dashboard': 'Panel del instructor',
  '/instructor/cursos': 'Mis cursos',
  '/instructor/courses/new': 'Nuevo curso',
  '/instructor/courses/:id': 'Editar curso',
  '/instructor/students': 'Estudiantes',
  '/instructor/analytics': 'Analíticas',
  
  // Rutas de administrador (se manejan en el AdminLayout)
  '/admin': 'Panel de administración',
  '/admin/users': 'Gestión de usuarios',
  '/admin/courses': 'Gestión de cursos',
  '/admin/settings': 'Configuración del sitio',
};

/**
 * Obtiene el título de la página basado en la ruta
 * @param {string} path - Ruta actual
 * @returns {string} Título de la página
 */
export const getPageTitle = (path) => {
  // Verificar coincidencia exacta primero
  if (routeTitles[path]) {
    return routeTitles[path];
  }
  
  // Buscar coincidencias con parámetros dinámicos (ej: /courses/123)
  const pathSegments = path.split('/').filter(Boolean);
  
  for (const [route, title] of Object.entries(routeTitles)) {
    const routeSegments = route.split('/').filter(Boolean);
    
    if (pathSegments.length !== routeSegments.length) continue;
    
    const isMatch = routeSegments.every((segment, index) => {
      return segment.startsWith(':') || segment === pathSegments[index];
    });
    
    if (isMatch) return title;
  }
  
  // Si no hay coincidencia, devolver un título por defecto
  return 'Página no encontrada';
};
