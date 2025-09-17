import { useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

/**
 * Componente que maneja dinámicamente el título del documento basado en la ruta actual
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.routeTitles - Mapa de rutas a títulos
 * @param {string} props.defaultTitle - Título por defecto cuando no hay coincidencia
 * @param {boolean} props.includeAppName - Si incluir el nombre de la app después del título
 * @param {string} props.appName - Nombre de la aplicación
 */
const TitleManager = ({
  routeTitles = {},
  defaultTitle = 'E-Learning Platform',
  includeAppName = true,
  appName = 'E-Learning',
  ...props
}) => {
  const location = useLocation();
  const matches = useMatches();
  
  // Get the current path from the last match or use location as fallback
  const currentPath = matches[matches.length - 1]?.pathname || location.pathname;

  useEffect(() => {
    try {
      // Buscar el título más específico para la ruta actual
      let title = defaultTitle;
      
      // Primero intentar con las rutas coincidentes
      if (matches && matches.length > 0) {
        for (let i = matches.length - 1; i >= 0; i--) {
          const match = matches[i];
          if (match.pathname in routeTitles) {
            title = routeTitles[match.pathname];
            break;
          }
        }
      } 
      // Si no hay coincidencias, intentar con la ruta actual
      else if (currentPath in routeTitles) {
        title = routeTitles[currentPath];
      }

      // Aplicar el título al documento
      const newTitle = includeAppName ? `${title} | ${appName}` : title;
      if (document.title !== newTitle) {
        document.title = newTitle;
      }

    } catch (error) {
      console.error('Error setting document title:', error);
      document.title = includeAppName ? `${defaultTitle} | ${appName}` : defaultTitle;
    }

    // Restaurar el título original al desmontar
    return () => {
      document.title = includeAppName ? `${defaultTitle} | ${appName}` : defaultTitle;
    };
  }, [currentPath, matches, routeTitles, defaultTitle, includeAppName, appName]);

  // Este componente no renderiza nada
  return null;
};

export default TitleManager;
