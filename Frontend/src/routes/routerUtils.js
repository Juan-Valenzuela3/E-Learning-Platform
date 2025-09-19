import React, { Suspense } from "react";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

// Lazy load ErrorPage (Página de error)
const ErrorPage = React.lazy(() => import("@/pages/ErrorPage"));

// Agregar errorElement a todas las rutas
export const withErrorHandling = (routes) => {
  return routes.map((route) => ({
    ...route,
    errorElement: (
      <Suspense
        fallback={<LoadingSpinner text="Cargando página de error..." />}>
        <ErrorPage />
      </Suspense>
    ),
    children: route.children ? withErrorHandling(route.children) : undefined,
  }));
};
