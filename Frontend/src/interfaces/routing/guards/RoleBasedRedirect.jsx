import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/shared/hooks/useAuth';

export default function RoleBasedRedirect() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentPath = location.pathname;

  // Teacher: any /teacher path is considered valid
  if (user.role === 'teacher') {
    const isTeacherPath = currentPath.startsWith('/teacher');
    if (!isTeacherPath) {
      return <Navigate to="/teacher/dashboard" replace />;
    }
  }

  // Student: allow only known student paths
  if (user.role === 'student') {
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

  // Already on a valid path for the role
  return null;
}
