import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user, loading, error: authError } = useAuth();
  const location = useLocation();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50">
            <Loader2 className="h-8 w-8 text-red-500 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Verificando acceso</h2>
            <p className="text-gray-500">Estamos validando tus permisos de profesor...</p>
          </div>
        </div>
      </div>
    );
  }

  // Authentication error
  if (authError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 bg-red-500">
            <h2 className="text-lg font-semibold text-white text-center">Error de autenticación</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">¡Ups, algo salió mal!</h3>
              <p className="text-gray-500">{authError.message || 'No se pudo verificar tu sesión.'}</p>
            </div>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Reintentar
              </button>
              <a
                href="/auth"
                className="text-center text-sm font-medium text-red-600 hover:text-red-500"
              >
                Volver al inicio de sesión
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - Redirect to login with smooth transition
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm mx-auto">
          <div className="animate-pulse">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-gray-600">Redirigiendo al inicio de sesión...</p>
          </div>
        </div>
        <Navigate to="/auth" state={{ from: location }} replace />
      </div>
    );
  }

  // Check if user has teacher or instructor role
  const normalizedRole = user?.role?.toString().toLowerCase().trim();
  const isTeacher = normalizedRole === 'teacher' || normalizedRole === 'instructor';
  
  if (!isTeacher) {
    console.warn(`Acceso denegado: Usuario con rol ${user?.role} intentó acceder a una ruta de profesor`);
    
    // Redirect based on user role
    if (normalizedRole === 'student') {
      return <Navigate to="/dashboard" replace />;
    }
    
    // Default redirect for other roles
    return <Navigate to="/no-autorizado" state={{ from: location }} replace />;
  }

  return children;
};

export default TeacherRoute;
