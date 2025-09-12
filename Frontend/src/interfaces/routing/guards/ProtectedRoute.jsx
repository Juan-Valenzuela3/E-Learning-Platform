// Importar hooks necesarios de React
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";
import NotFound from "@/shared/ui/layout/NotFound";

const ProtectedRoute = ({ children, allowedRoles = ['student', 'teacher'] }) => {
  // Obtener el estado de autenticación y usuario del hook useAuth
  const { isAuthenticated, user, loading, error: authError } = useAuth();
  const location = useLocation();
  
  // Estados locales para manejar la carga y errores
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState(null);

  // Efecto para sincronizar el estado de carga y manejar errores
  useEffect(() => {
    // Actualizar estado de carga
    setIsLoading(loading);

    // Si hay un error de autenticación, mostrarlo
    if (authError) {
      setError('Error al verificar la autenticación. ' + (authError.message || ''));
      setIsLoading(false);
    }
  }, [loading, authError]);

  // Función para reintentar la carga
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    window.location.reload();
  };

  // Mostrar mensaje de error si existe
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Mostrar indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4">Verificando autenticación...</span>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario tiene un rol permitido
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/not-found" replace />;
  }

  // Si todo está bien, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;