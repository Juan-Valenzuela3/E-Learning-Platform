import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function RoleBasedRedirect() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, mostramos un spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname;

  // Profesor: cualquier ruta que comience con /teacher es considerada válida
  if (user.role === 'INSTRUCTOR' || user.role === 'teacher') {
    const isTeacherPath = currentPath.startsWith('/teacher');
    if (!isTeacherPath) {
      return <Navigate to="/teacher/dashboard" replace />;
    }
  }

  // Admin: redirigir a /admin si no está ya en una ruta de admin
  if (user.role === 'ADMIN' || user.role === 'admin') {
    const isAdminPath = currentPath.startsWith('/admin');
    if (!isAdminPath) {
      return <Navigate to="/admin" replace />;
    }
    return null; // Ya está en una ruta de admin
  }

  // Estudiante: cualquier ruta que comience con /student es considerada válida
  if (user.role === 'STUDENT' || user.role === 'student') {
    const isStudentPath = (
      currentPath.startsWith('/dashboard') ||
      currentPath.startsWith('/mis-cursos') ||
      currentPath.startsWith('/pagos') ||
      currentPath.startsWith('/perfil') ||
      currentPath.startsWith('/curso/')
    );
    if (!isStudentPath) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Usuario ya está en una ruta válida para su rol
  return null;
}
