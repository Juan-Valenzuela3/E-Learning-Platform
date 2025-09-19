import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Hook personalizado para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
