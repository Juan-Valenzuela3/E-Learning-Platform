import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personalizado para manejar el título del documento y notificaciones de cambio de pestaña
 * @param {string} title - El título que se mostrará en la pestaña del navegador
 * @param {Object} [options] - Opciones adicionales
 * @param {boolean} [options.includeAppName=true] - Si incluir el nombre de la app después del título
 * @param {string} [options.appName='E-Learning'] - Nombre de la aplicación a mostrar
 * @param {boolean} [options.notifyOnFocus=false] - Mostrar notificación al volver a la pestaña
 * @param {string} [options.notificationTitle] - Título de la notificación (por defecto usa el título)
 * @param {string} [options.notificationMessage] - Mensaje de la notificación
 * @param {string} [options.favicon] - URL del favicon a mostrar cuando la pestaña está inactiva
 */
const useDocumentTitle = (title, options = {}) => {
  const {
    includeAppName = true,
    appName = 'E-Learning',
    notifyOnFocus = false,
    notificationTitle,
    notificationMessage,
    favicon = '/favicon.ico'
  } = options;

  const location = useLocation();
  const originalTitle = useRef(document.title);
  const faviconElement = useRef(null);

  // Actualizar el título del documento
  useEffect(() => {
    const newTitle = includeAppName && title ? `${title} | ${appName}` : title || appName;
    
    // Solo actualizar si el título ha cambiado
    if (document.title !== newTitle) {
      originalTitle.current = document.title;
      document.title = newTitle;
    }

    // Restaurar el título original al desmontar
    return () => {
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    };
  }, [title, includeAppName, appName]);

  // Configurar notificaciones al cambiar de pestaña
  useEffect(() => {
    if (!notifyOnFocus) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Mostrar notificación
        if (Notification.permission === 'granted') {
          new Notification(
            notificationTitle || title || appName,
            {
              body: notificationMessage || '¡Bienvenido de nuevo!',
              icon: favicon
            }
          );
        }
        
        // Restaurar el favicon original si se cambió
        if (faviconElement.current) {
          document.head.removeChild(faviconElement.current);
          faviconElement.current = null;
        }
      } else if (favicon) {
        // Cambiar el favicon cuando la pestaña está inactiva
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = favicon;
        document.head.appendChild(link);
        faviconElement.current = link;
      }
    };

    // Solicitar permiso para notificaciones
    if (notifyOnFocus && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Limpiar el favicon personalizado al desmontar
      if (faviconElement.current) {
        document.head.removeChild(faviconElement.current);
      }
    };
  }, [notifyOnFocus, title, notificationTitle, notificationMessage, favicon, appName]);

  // Actualizar el título cuando cambia la ruta
  useEffect(() => {
    const newTitle = includeAppName && title ? `${title} | ${appName}` : title || appName;
    if (document.title !== newTitle) {
      document.title = newTitle;
    }
  }, [location.pathname, title, includeAppName, appName]);

  // Función para actualizar el título manualmente
  const setDocumentTitle = (newTitle, options = {}) => {
    const {
      includeAppName: includeAppNameOption = includeAppName,
      appName: appNameOption = appName
    } = options;
    
    const finalTitle = includeAppNameOption && newTitle 
      ? `${newTitle} | ${appNameOption}` 
      : newTitle || appNameOption;
      
    document.title = finalTitle;
  };

  return { setDocumentTitle };
};

export default useDocumentTitle;
