import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import publicRoutes from './publicRoutes';
import privateRoutes from './PrivateRoutes';
import teacherRoutes from './teacherRoutes';
import { adminRoutes } from './adminRoutes';
import ErrorPage from '@/pages/ErrorPage';
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import ProtectedRoute from '@/interfaces/routing/guards/ProtectedRoute';

// Lazy load admin layout
const AdminLayout = lazy(() => import('@/features/admin/pages/AdminLayout'));

// Add errorElement to all routes
const withErrorHandling = (routes) => {
  return routes.map(route => ({
    ...route,
    errorElement: <ErrorPage />,
    children: route.children ? withErrorHandling(route.children) : undefined
  }));
};

import RootLayout from '@/layouts/RootLayout';

export const router = createBrowserRouter([
  // Main layout with title management
  {
    element: <RootLayout />,
    children: [
      // Admin routes first to ensure they take precedence
      {
        path: '/admin/*',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner text="Cargando panel de administración..." />
              </div>
            }>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        ),
        children: adminRoutes[0].children
      },
      // Then public routes
      ...withErrorHandling(publicRoutes),
      // Then teacher routes
      ...withErrorHandling(teacherRoutes),
      // Then private routes
      ...withErrorHandling(privateRoutes),
      // Catch-all route - must be last
      {
        path: '*',
        element: <Navigate to="/404" replace />
      }
    ]
  }
], {
  future: {
    v7_normalizeFormMethod: true
  }
});

export const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner text="Cargando la aplicación..." />
        </div>
      }
    >
      <RouterProvider
        router={router}
        fallbackElement={
          <div className="flex items-center justify-center min-h-screen">
            <LoadingSpinner text="Cargando la aplicación..." />
          </div>
        }
      />
    </Suspense>
  );
}