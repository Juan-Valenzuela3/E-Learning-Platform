import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import LandingLayout from "@/ui/layout/LandingLayout";
import LoadingFallback from "@/shared/components/LoadingFallback";
import ErrorPage from "@/pages/ErrorPage";

// importar paginas con lazy
const LandingPage = lazy(() => import("@/features/marketing/pages/Home"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() =>
  import("@/features/auth/pages/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(() =>
  import("@/features/auth/pages/ResetPasswordPage")
);
const CatalogoCursos = lazy(() =>
  import("@/features/marketing/pages/CatalogoCursos")
);
const CourseDetail = lazy(() =>
  import("@/features/student/pages/CourseDetailPage")
);
const EnhancedCourseContent = lazy(() =>
  import("@/features/course/components/EnhancedCourseContent")
);
const PaymentSuccess = lazy(() =>
  import("@/features/payment/pages/PaymentSuccess")
);
const PaymentCancel = lazy(() =>
  import("@/features/payment/pages/PaymentCancel")
);
const NotFoundPage = lazy(() => import("@/shared/ui/layout/NotFound"));
const MockDataTest = lazy(() => import("@/test/MockDataTest"));
const PricingPage = lazy(() => import("@/features/marketing/pages/PricingPage"));
const ComoFunciona = lazy(() =>
  import("@/features/marketing/pages/comoFunciona")
);
const TestConnection = lazy(() => import("@/features/test/TextConnection"));
const VideoTest = lazy(() => import("@/test/VideoTest"));
const SimpleVideoTest = lazy(() => import("@/test/SimpleVideoTest"));
const JsonParsingTest = lazy(() => import("@/test/JsonParsingTest"));

const CentroAyuda = lazy(() => import("@/pages/CentroAyuda"));
const Contacto = lazy(() => import("@/pages/Contacto"));
const TerminosUso = lazy(() => import("@/pages/TerminosUso"));
const Privacidad = lazy(() => import("@/pages/Privacidad"));
const AuthLoadingScreen = lazy(() => import("@/shared/components/auth/AuthLoadingScreen"));
const publicRoutes = [
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        index: true,
        errorElement: <ErrorPage />,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LandingPage />
          </Suspense>
        ),
      },
      {
        path: "precios",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PricingPage />
          </Suspense>
        ),
      },
      {
        path: "comoFunciona",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ComoFunciona />
          </Suspense>
        ),
      },
      {
        path: "centro-ayuda",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CentroAyuda />
          </Suspense>
        ),
      },
      {
        path: "contacto",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Contacto />
          </Suspense>
        ),
      },
      {
        path: "terminos-de-uso",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TerminosUso />
          </Suspense>
        ),
      },
      {
        path: "politica-de-privacidad",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Privacidad />
          </Suspense>
        ),
      },
      {
        path: "test-connection",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <TestConnection />
          </Suspense>
        ),
      },
      {
        path: "video-test",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <VideoTest />
          </Suspense>
        ),
      },
      {
        path: "simple-video-test",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SimpleVideoTest />
          </Suspense>
        ),
      },
      {
        path: "json-parsing-test",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <JsonParsingTest />
          </Suspense>
        ),
      },
      {
        path: "mock-data-test",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <MockDataTest />
          </Suspense>
        ),
      },
      {
        path: "cursos",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CatalogoCursos />
          </Suspense>
        ),
      },
      {
        path: "payment/success",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PaymentSuccess />
          </Suspense>
        ),
      },
      {
        path: "payment/cancel",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <PaymentCancel />
          </Suspense>
        ),
      },
      {
        path: "curso/:courseId",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <CourseDetail />
          </Suspense>
        ),
      },
      {
        path: "curso/:courseId/content",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <EnhancedCourseContent />
          </Suspense>
        ),
      },
      {
        path: "not-found",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Navigate to="/not-found" replace />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "authentication",
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Navigate to="/authentication/login" replace />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "reset-password",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ResetPasswordPage />
          </Suspense>
        ),
      },
      {
        path: "auth-loading",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AuthLoadingScreen />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Navigate to="/authentication/login" replace />
          </Suspense>
        ),
      },
    ],
  },
];

export default publicRoutes;
