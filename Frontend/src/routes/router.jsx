import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import publicRoutes from './publicRoutes';
import privateRoutes from './PrivateRoutes';
import teacherRoutes from './teacherRoutes';


const router = createBrowserRouter([
  ...publicRoutes,
  // ...privateRoutes,
  // ...teacherRoutes
], {
  future: {
    v7_normalizeFormMethod: true,
  },
});

export { router };




export default function AppRouter() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <RouterProvider router={router} />  
    </Suspense>
  );
}