import { useNavigate } from "react-router-dom";
import ResetPasswordForm from "@/features/auth/components/forms/ResetPasswordForm";
import logo from "@/assets/logo.svg";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="EduPlatform Logo"
            className="h-16 w-16 mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
          <p className="text-gray-600">
            Crea una nueva contraseña para tu cuenta
          </p>
        </div>

        {/* Formulario de restablecimiento */}
        <ResetPasswordForm />

        {/* Enlaces adicionales */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            ¿Recordaste tu contraseña?{" "}
            <button
              onClick={() => navigate("/authentication/login")}
              className="font-medium text-red-500 hover:text-red-600 transition-colors">
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
