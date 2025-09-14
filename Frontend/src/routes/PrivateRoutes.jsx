import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "@/ui/layout/AppLayout";
import ProtectedRoute from "@/interfaces/routing/guards/ProtectedRoute";
import RoleBasedRedirect from "@/interfaces/routing/guards/RoleBasedRedirect";
import ErrorBoundary from "@/ui/common/ErrorBoundary";
import { Box, CircularProgress } from '@mui/material';

// Componentes de estudiante
const DashboardStats = lazy(() => import("@/features/student/components/DashboardStats"));
const Profile = lazy(() => import("@/features/student/components/StudentProfileEditor"));
const PurchasedCourses = lazy(() => import("@/features/student/components/PurchasedCourses"));
const CourseContent = lazy(() => import("@/features/course/components/CourseContent"));
const CourseDetail = lazy(() => import("@/features/course/components/CourseDetail"));
// const PaymentHistory = lazy(() => import("@/features/student/components/PaymentHistory"));
const NotFound = lazy(() => import("@/shared/ui/layout/NotFound"));
const DataPolicy = lazy(() => import("@/shared/ui/common/DataPolicy"));
const StudentPage = lazy(() => import("@/features/student/pages/StudentPage"));

// Componente de carga
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const privateRoutes = [
  // Ruta raíz que redirige según el rol
  {
    path: "/",
    element: <RoleBasedRedirect />
  },
  // Rutas de estudiante
  {
    element: (
      <ProtectedRoute allowedRoles={['STUDENT', 'student']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <StudentPage />,
      },
      {
        path: "/perfil",
        element: <Profile />,
      },
      {
        path: "/mis-cursos",
        element: <PurchasedCourses />,
      },
      {
        path: "/curso/:id",
        element: <CourseContent />,
      },
      // {
      //   path: "/pagos",
      //   element: <PaymentHistory />,
      // },
      {
        path: "/politica-de-privacidad",
        element: <DataPolicy />,
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
  // Redirección para usuarios con rol de profesor
  {
    path: "/teacher/*",
    element: (
      <ProtectedRoute allowedRoles={['INSTRUCTOR', 'teacher']}>
        <Navigate to="/teacher/dashboard" replace />
      </ProtectedRoute>
    )
  }
];

export default privateRoutes;