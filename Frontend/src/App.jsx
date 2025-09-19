import { Suspense, useCallback } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AuthProvider } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContextProvider";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/services/queryClient";

function App() {
  const handleLogout = useCallback(() => {
    // La redirección se manejará a través del router
    return "/authentication";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider onLogout={handleLogout}>
        <SidebarProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <RouterProvider router={router} />
            <ToastContainer
              position="center-center"
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
                backgroundColor: "#fff",
                color: "#111827",
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              progressStyle={{
                background: "#ef4444",
              }}
            />
          </Suspense>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
