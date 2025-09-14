import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from '@/ui/common/ErrorBoundary';
import AppLayout from '@/ui/layout/AppLayout';
import ProtectedRoute from '@/interfaces/routing/guards/ProtectedRoute';

// Lazy load all teacher components
const TeacherDashboard = lazy(() => import('@/features/teacher/components/TeacherDashboard'));
const TeacherDashboardHome = lazy(() => import('@/features/teacher/components/TeacherDashboardHome'));
const AnalyticsDashboard = lazy(() => import('@/features/teacher/components/AnalyticsDashboard'));
const TeacherMessages = lazy(() => import('@/features/teacher/components/TeacherMessages'));

const VideoProductionGuide = lazy(() => import('@/features/teacher/components/VideoProductionGuide'));
const TeacherCourses = lazy(() => import('@/features/teacher/components/TeacherCourses'));
const CreateCourse = lazy(() => import('@/features/teacher/components/CreateCourse'));
const EditCourse = lazy(() => import('@/features/teacher/components/EditCourse'));
//importamo el componete para ver los estudiante inscritos en un curso
const TeacherStudents = lazy(() => import('@/features/teacher/components/TeacherStudentsComponent'));

const CourseDetail = lazy(() => import('@/features/teacher/components/CourseDetail'));

const TeacherProfile = lazy(() => import('@/features/teacher/components/TeacherProfileEditor'));
const TeacherSettings = lazy(() => import('@/features/teacher/components/TeacherSettings'));

// Loading component with consistent styling
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-red-500" />
      <p className="text-gray-600">Cargando contenido...</p>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-6 max-w-2xl mx-auto text-center">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-red-800 mb-2">¡Algo salió mal!</h3>
      <p className="text-red-600 mb-4">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>
);

// Wrapper component for lazy loading with error boundary and suspense
const LazyComponent = ({ component: Component, ...props }) => (
  <ErrorBoundary fallback={ErrorFallback}>
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  </ErrorBoundary>
);

const teacherRoutes = [
  {
    element: (
      <ProtectedRoute allowedRoles={['teacher', 'instructor']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/teacher',
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherDashboardHome} />
              }
            ]
          },
          {
            path: 'profile',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherProfile} />
              }
            ]
          },
          {
            path: 'courses',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherCourses} />
              },
              {
                path: 'new',
                element: <LazyComponent component={CreateCourse} />
              },
              {
                path: ':id',
                element: <LazyComponent component={CourseDetail} />,
                children: [
                  {
                    path: 'edit',
                    element: <LazyComponent component={EditCourse} />
                  }
                ]
              }
            ]
          },
          {
            path: 'students',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherStudents} />
              },
              {
                path: ':courseId',
                element: <LazyComponent component={TeacherStudents} />
              }
            ]
          },
          {
            path: 'analytics',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={AnalyticsDashboard} />
              }
            ]
          },
          {
            path: 'messages',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherMessages} />
              }
            ]
          },
          {
            path: 'settings',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={TeacherSettings} />
              }
            ]
          },
          {
            path: 'video-guide',
            element: <LazyComponent component={TeacherDashboard} />,
            children: [
              {
                index: true,
                element: <LazyComponent component={VideoProductionGuide} />
              }
            ]
          },
          {
            path: '*',
            element: <Navigate to="/teacher/dashboard" replace />
          }
        ]
      }
    ]
  }
];

export default teacherRoutes;   