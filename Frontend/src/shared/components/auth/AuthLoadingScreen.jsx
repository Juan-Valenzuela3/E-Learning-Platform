import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthLoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setError(null);
        setProgress(0);

        // Step 1: Verificar autenticación
        setCurrentStep(1);
        setProgress(20);
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simular verificación

        if (!isAuthenticated || !user) {
          console.log("Usuario no autenticado, redirigiendo al login");
          navigate("/authentication/login");
          return;
        }

        // Step 2: Verificar datos del usuario
        setCurrentStep(2);
        setProgress(50);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!user.role) {
          console.log("Usuario sin rol, cerrando sesión");
          await logout();
          navigate("/authentication/login");
          return;
        }

        // Step 3: Redirigir según el rol
        setCurrentStep(3);
        setProgress(80);
        await new Promise((resolve) => setTimeout(resolve, 500));

        const normalizedRole = user.role?.toUpperCase();
        console.log("Rol detectado:", normalizedRole);

        // Recargar la página para asegurar un estado limpio
        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 300));

        switch (normalizedRole) {
          case "ADMIN":
            console.log("Redirigiendo a admin");
            window.location.href = "/admin";
            break;
          case "INSTRUCTOR":
          case "TEACHER":
            console.log("Redirigiendo a teacher dashboard");
            window.location.href = "/teacher/dashboard";
            break;
          case "STUDENT":
          default:
            console.log("Redirigiendo a dashboard");
            window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Error en la verificación de autenticación:", error);
        setError(error.message || "Error al verificar la autenticación");

        // Cerrar sesión en caso de error
        try {
          await logout();
        } catch (logoutError) {
          console.error("Error al cerrar sesión:", logoutError);
        }

        // Redirigir al login después de mostrar el error
        setTimeout(() => {
          window.location.href = "/authentication/login";
        }, 5000);
      } finally {
        setProgress(100);
      }
    };

    verifyAuth();
  }, [navigate, user, logout, isAuthenticated]);

  const getStepMessage = () => {
    switch (currentStep) {
      case 1:
        return "Verificando credenciales...";
      case 2:
        return "Cargando su perfil...";
      case 3:
        return "Redirigiendo...";
      default:
        return "Procesando...";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error de autenticación
          </h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <p className="text-xs text-gray-500">
            Redirigiendo a la página de inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {/* Robot Icon */}
        <div className="w-20 h-20 mx-auto mb-6">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="animate-pulse">
            {/* Robot Head */}
            <circle
              cx="40"
              cy="35"
              r="20"
              fill="#EF4444"
              stroke="#DC2626"
              strokeWidth="2"
            />

            {/* Eyes */}
            <circle cx="33" cy="30" r="3" fill="white" />
            <circle cx="47" cy="30" r="3" fill="white" />

            {/* Eye pupils */}
            <circle cx="33" cy="30" r="1.5" fill="#1F2937" />
            <circle cx="47" cy="30" r="1.5" fill="#1F2937" />

            {/* Mouth */}
            <path
              d="M32 38 Q40 42 48 38"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Headphones */}
            <ellipse
              cx="40"
              cy="25"
              rx="25"
              ry="12"
              fill="none"
              stroke="white"
              strokeWidth="4"
              opacity="0.9"
            />

            {/* Headphone details */}
            <circle cx="20" cy="25" r="4" fill="white" />
            <circle cx="60" cy="25" r="4" fill="white" />

            {/* Antenna */}
            <line
              x1="40"
              y1="15"
              x2="40"
              y2="5"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Antenna tip */}
            <circle cx="40" cy="5" r="2" fill="#EF4444" />

            {/* Antenna signal lines */}
            <path
              d="M40 5 Q45 2 50 5"
              stroke="#EF4444"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M40 5 Q35 2 30 5"
              stroke="#EF4444"
              strokeWidth="1.5"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Iniciando Sesión
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 mb-6">
          La información se está procesando, por favor espere...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}></div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep >= 1 ? "bg-red-500" : "bg-gray-300"
            }`}></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep >= 2 ? "bg-red-500" : "bg-gray-300"
            }`}></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentStep >= 3 ? "bg-red-500" : "bg-gray-300"
            }`}></div>
        </div>

        {/* Current Step Message */}
        <p className="text-xs text-gray-500">{getStepMessage()}</p>

        {/* Loading Animation */}
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthLoadingScreen;
