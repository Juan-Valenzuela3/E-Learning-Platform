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
const PaymentHistory = lazy(() => import("@/features/student/components/PaymentHistory"));
const NotFound = lazy(() => import("@/shared/ui/layout/NotFound"));
const DataPolicy = lazy(() => import("@/shared/ui/common/DataPolicy"));
const StudentPage = lazy(() => import("@/features/student/pages/StudentPage"));

// Componentes de profesor
const TeacherDashboard = lazy(() => import("@/features/teacher/components/TeacherDashboard"));
const TeacherCourses = lazy(() => import("@/features/teacher/components/TeacherCourses"));
const CreateCourse = lazy(() => import("@/features/teacher/components/CreateCourse")
  .catch(() => ({ default: () => <ErrorBoundary>Error al cargar el componente de creación de curso</ErrorBoundary> })));
const EditCourse = lazy(() => import("@/features/teacher/components/EditCourse"));
const TeacherStudents = lazy(() => import("@/features/teacher/components/TeacherStudents"));
const Students = lazy(() => import("@/features/teacher/components/Students"));

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
      <ProtectedRoute allowedRoles={['student']}>
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
      {
        path: "/pagos",
        element: <PaymentHistory />,
      },
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
  // Rutas de profesor
  {
    element: (
      <ProtectedRoute allowedRoles={['teacher']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/teacher",
        element: <TeacherDashboard />,
      },
      
      {
        path: "/teacher/courses",
        element: <TeacherCourses />,
      },
      {
        path: "/teacher/courses/new",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <CreateCourse />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "/teacher/courses/:id/edit",
        element: <EditCourse />,
      },
      {
        path: "/teacher/students",
        element: <Students />,
      },
      {
        path: "/teacher/students/:courseId",
        element: <TeacherStudents />,
      },
      {
        path: "/teacher/profile",
        element: <Profile />,
      },
      {
        path: "/teacher/*",
        element: <Navigate to="/teacher" replace />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  }
];

export default privateRoutes;
