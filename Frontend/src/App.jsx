
import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes";
function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Cargando...
        </div>
      }>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
