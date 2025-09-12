// src/features/auth/pages/AuthPage.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "@/features/auth/components/forms/LoginForm";
import RegisterForm from "@/features/auth/components/forms/RegisterForm";
import logo from "@/assets/logo.svg";


export default function AuthPage() {
  const location = useLocation();
  const initialIsLogin = location.state?.showLogin === true;
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        {/* Sección del logo y texto de marca */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="EduPlatform Logo" className="h-16 w-16 mb-2" />
          <h2 className="text-xl font-bold">EduPlatform</h2>
          <p className="text-gray-500 text-sm">Plataforma de Cursos en Línea</p>
        </div>

        {/* Botones para alternar entre Iniciar Sesión y Registrarse */}
        <div className="flex mb-6 rounded-lg bg-gray-200 p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg transition-colors ${isLogin ? "bg-black text-white" : "text-gray-700"}`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg transition-colors ${!isLogin ? "bg-black text-white" : "text-gray-700"}`}
          >
            Registrarse
          </button>
        </div>

        {/* Renderizado condicional de los componentes de formulario */}
        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}