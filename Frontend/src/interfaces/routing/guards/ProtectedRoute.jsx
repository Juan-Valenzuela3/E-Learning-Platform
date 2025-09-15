import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  allowedRoles = ['student', 'teacher', 'instructor', 'admin'] 
}) => {
  const { isAuthenticated, user, loading, error: authError } = useAuth();
  const location = useLocation();

  // Normalize roles (map 'instructor' to 'teacher' for compatibility)
  const normalizeRole = (role) => {
    if (!role) return 'guest';
    const normalized = role.toString().toLowerCase().trim();
    return normalized === 'instructor' ? 'teacher' : normalized;
  };
  
  const userRole = normalizeRole(user?.role);
  const allowedRolesNormalized = allowedRoles.map(r => normalizeRole(r));
  const hasRequiredRole = allowedRolesNormalized.includes(userRole);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Authentication error
  if (authError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error de autenticación</h2>
          <p className="text-red-500 mb-6">{authError.message || 'No se pudo verificar la sesión'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (!hasRequiredRole) {
    console.warn(`Acceso denegado: El usuario con rol ${user?.role} no tiene permiso para acceder a esta ruta`);
    
    // Redirect based on user role
    if (userRole === 'student') return <Navigate to="/dashboard" replace />;
    if (userRole === 'teacher' || userRole === 'instructor') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
};

export default ProtectedRoute;
