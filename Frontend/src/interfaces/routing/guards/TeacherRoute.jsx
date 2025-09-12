import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";

const TeacherRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir a login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar si el usuario es un profesor
  if (user?.role !== 'teacher') {
    console.log(`Acceso denegado: El usuario con rol ${user?.role} intentó acceder a una ruta de profesor`);
    // Redirigir a no encontrado si no es profesor
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

export default TeacherRoute;
