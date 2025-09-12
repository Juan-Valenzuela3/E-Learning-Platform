import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
//import LandingLayout from "@/ui/layout/LandingLayout";
//import NotFound from "@/shared/ui/layout/NotFound";
import path from 'path';
//const Home = lazy(() => import("@/features/marketing/pages/Home"));
//const LoginPage = lazy(() => import("@/features/auth/pages/AuthPage"));
//const CatalogoCursos = lazy(() => import("@/features/marketing/pages/CatalogoCursos"));
//const ComoFunciona = lazy(() => import("@/features/marketing/pages/comoFunciona"));

const TestConnection = lazy(()=>import("@/features/test/TextConnection"))

const publicRoutes = [
 // {
  //   path: "/",
  //   element: <LandingLayout />,
   //  children: [
   //    {
    //     index: true,
    //     element: <Home />,
    //   },
    //   {
    //     path: "comoFunciona",
     //    element: <ComoFunciona />,
     //  },
   //  ],
  //},
  //{
  //  path: "/login",
  //  element: <LoginPage />,
  //},
  //{
   // path: "/cursos",
   // element: <CatalogoCursos />,
  //},
  //{
   // path: "*",
   // element: <Navigate to="not-found" replace />,
  //},
  //{
   // path: "not-found",
    //element: <NotFound />,
  //},


{
 path: "/test-connection",
element: <TestConnection />,
}
  ]

export default publicRoutes;
