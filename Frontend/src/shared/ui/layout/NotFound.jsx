import { Button } from "@/ui/Button";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import  notFound from "@/assets/404.svg"

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <img className="w-1/2" src={notFound} alt="404"/>
      <div className="max-w-md w-full text-center">
        <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Ups! Página no encontrada</h1>
        <p className="text-gray-600 mb-8">
          La pagina que buscas no existe o ha sido movida.
        </p>
       
       
      </div>
    </div>
  );
}
