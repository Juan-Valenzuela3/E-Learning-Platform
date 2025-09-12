import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState } from "react";

function App() {
 
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Cargando...
          </div>
        }>
        <RouterProvider router={router}  />
      </Suspense>
    </AuthProvider>
  );
}

export default App;
