import React, { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import LandingLayout from "@/ui/layout/LandingLayout";
import LoadingSpinner from "@/components/LoadingSpinner";

// Retraso artificial para mostrar el spinner de carga
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Lazy load components with Suspense wrapper and minimum loading time
const withSuspense = (Component, minDelay = 0) => (props) => {
  const [isDelayed, setIsDelayed] = React.useState(true);
  
  React.useEffect(() => {
    if (minDelay > 0) {
      const timer = setTimeout(() => setIsDelayed(false), minDelay);
      return () => clearTimeout(timer);
    } else {
      setIsDelayed(false);
    }
  }, [minDelay]);

  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      {isDelayed ? (
        <div className="min-h-[60vh] flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <Component {...props} />
      )}
    </Suspense>
  );
};

// lazy cargar componente
const lazyLoad = (importFn) => withSuspense(lazy(importFn));

// importar paginas con lazy 
const LandingPage = lazy(() => import("@/features/marketing/pages/Home"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"))
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"))
const CatalogoCursos = lazy(() => import("@/features/marketing/pages/CatalogoCursos"));
const CourseDetail = lazy(() => import("@/features/course/components/CourseDetail"));
const NotFoundPage = lazy(() => import("@/shared/ui/layout/NotFound"));
const ComoFunciona = lazyLoad(() => import("@/features/marketing/pages/comoFunciona"));
const TestConnection = lazyLoad(() => import("@/features/test/TextConnection"));
const ErrorPage = lazyLoad(() => import("@/pages/ErrorPage"));

const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        errorElement: <ErrorPage />,
        element: <LandingPage />,
      },
      {
        path: "comoFunciona",
        element: <ComoFunciona />,
      },
      {
        path: "test-connection",
        element: <TestConnection />,
      },
      {
        path: "cursos",
        element: <CatalogoCursos />,
      },
      {
        path: "curso/:courseId/detalle",
        element: <CourseDetail />,
      },
      {
        path: "not-found",
        element: <NotFoundPage />,
      },
      {
        path: "*",
        element: <Navigate to="/not-found" replace />,
      },
    ],
  },
  {
    path: "authentication",
    children: [
      {
        index: true,
        element: <Navigate to="/authentication/login" replace />
      },
      {
        path: "login",
        element: <LoginPage />
      },
      {
        path: "register",
        element: <RegisterPage />
      },
      {
        path: "*",
        element: <Navigate to="/authentication/login" replace />
      }
    ]
  },
 
 
];

export default publicRoutes;
