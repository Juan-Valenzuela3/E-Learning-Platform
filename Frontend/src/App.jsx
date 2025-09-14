import { Suspense, useCallback, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AuthProvider } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const handleLogout = useCallback(() => {
    // La redirección se manejará a través del router
    return '/authentication';
  }, []);

  return (
    <AuthProvider onLogout={handleLogout}>
      <Suspense fallback={<LoadingSpinner />}>
        <RouterProvider router={router} />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            backgroundColor: '#fff',
            color: '#111827',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
          progressStyle={{
            background: '#ef4444'
          }}
        />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
