import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import ProtectedRoute from "@/interfaces/routing/guards/ProtectedRoute";

// Lazy load components for better performance
const AdminLayout = lazy(() => import("@/features/admin/pages/AdminLayout"));
const DashboardPage = lazy(() =>
  import("@/features/admin/pages/DashboardPage")
);
const UsersPage = lazy(() => import("@/features/admin/pages/UsersPage"));
const NewUserPage = lazy(() => import("@/features/admin/pages/NewUserPage"));
const CoursesPage = lazy(() => import("@/features/admin/pages/CoursesPage"));
const NewCoursePage = lazy(() =>
  import("@/features/admin/pages/NewCoursePage")
);
const ReportsPage = lazy(() => import("@/features/admin/pages/ReportsPage"));

// Admin routes
export const adminRoutes = [
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner text="Cargando panel de administración..." />
            </div>
          }>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "usuarios",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <UsersPage />
          </Suspense>
        ),
      },
      {
        path: "usuarios/nuevo",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NewUserPage />
          </Suspense>
        ),
      },
      {
        path: "cursos",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <CoursesPage />
          </Suspense>
        ),
      },
      {
        path: "cursos/nuevo",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NewCoursePage />
          </Suspense>
        ),
      },
      {
        path: "reportes",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/admin" replace />,
      },
    ],
  },
];
