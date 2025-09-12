import { Navigate, useLocation } from 'react-router-dom';
import useAuth from "@/shared/hooks/useAuth";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect to the dashboard or the page they were trying to access before being redirected to login
    const from = location.state?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
