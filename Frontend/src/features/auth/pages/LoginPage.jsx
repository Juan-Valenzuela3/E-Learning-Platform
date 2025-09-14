import { useNavigate } from "react-router-dom";
import LoginForm from "@/features/auth/components/forms/LoginForm";
import logo from "@/assets/logo.svg";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img src={logo} alt="EduPlatform Logo" className="h-16 w-16 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido de nuevo</h1>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* Formulario de inicio de sesión */}
        <LoginForm />

        {/* Enlace a registro */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/authentication/register')}
              className="font-medium text-red-500 hover:text-red-600 transition-colors"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
