import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/ui/Button";
import { toast } from "sonner";
import FormInput from "@/ui/FormInput";
import api from "@/services/api";
import {
  Loader2,
  Copy,
  Check,
  Users,
  Shield,
  GraduationCap,
  User,
} from "lucide-react";
// import { duration } from "@mui/material";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [copiedItems, setCopiedItems] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validación de email
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Por favor, ingresa un correo electrónico válido";
    } else if (email.length > 254) {
      newErrors.email = "El correo electrónico es demasiado largo";
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (password.length > 128) {
      newErrors.password = "La contraseña es demasiado larga";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password =
        "La contraseña debe contener al menos una letra mayúscula, una minúscula y un número";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Función para mostrar errores de validación
  const showValidationErrors = (errors) => {
    Object.values(errors).forEach((error, index) => {
      setTimeout(() => {
        toast.error(error, {
          duration: 4000,
          position: "top-center",
        });
      }, index * 200);
    });
  };

  // Función para limpiar errores cuando el usuario empieza a escribir
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Función para copiar al portapapeles
  const copyToClipboard = async (text, type, role) => {
    try {
      await navigator.clipboard.writeText(text);
      const key = `${role}-${type}`;
      setCopiedItems((prev) => ({ ...prev, [key]: true }));
      toast.success(`${type === "email" ? "Email" : "Contraseña"} copiada`, {
        duration: 2000,
        position: "top-center",
      });

      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setCopiedItems((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
      toast.error("Error al copiar", {
        duration: 2000,
        position: "top-center",
      });
    }
  };

  // Función para llenar automáticamente los campos
  const fillCredentials = (email, password) => {
    setEmail(email);
    setPassword(password);
    setErrors({});
    toast.success("Credenciales cargadas", {
      duration: 2000,
      position: "top-center",
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validación del formulario
      if (!validateForm()) {
        showValidationErrors(errors);
        return;
      }
      //Mostramo una notificacion de carga
      toast.loading("Iniciando sesión...", {
        id: "login-loading",
        duration: 0,
      });

      // Llamada al backend
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
        rememberMe,
      });

      //Cerramos la notificacion de carga
      toast.dismiss("login-loading");

      if (!response.data.token)
        throw new Error("No se recibió el token de autenticación");

      const userData = {
        token: response.data.token,
        user: {
          id: response.data.userId,
          name: response.data.userName,
          email: response.data.email,
          role: response.data.role,
          isActive: response.data.isActive,
        },
      };

      // Loguear al usuario mediante AuthContext
      const loginResult = await login(userData);

      if (loginResult.success) {
        toast.success("¡Inicio de sesión exitoso!", {
          description: `Bienvenido, ${userData.user.name}`,
          duration: 3000,
          position: "top-center",
        });
        navigate("/authentication/auth-loading");
        // Redirigir según rol (mapear 'instructor' a 'teacher' para compatibilidad)
      } else {
        throw new Error(loginResult.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en login:", err);
      toast.dismiss("login-loading");

      let errorMessage = "Error al iniciar sesión";

      //manejo de errores específicos
      if (err.response?.status === 401) {
        errorMessage =
          "Credenciales incorrectas. Verifica tu email y contraseña";
      } else if (err.response?.status === 403) {
        errorMessage = "Tu cuenta está desactivada. Contacta al administrador";
      } else if (err.response?.status === 429) {
        errorMessage =
          "Demasiados intentos. Espera unos minutos antes de intentar nuevamente";
      } else if (err.response?.status >= 500) {
        errorMessage = "Error del servidor. Intenta más tarde";
      } else if (
        err.code === "NETWORK_ERROR" ||
        err.message.includes("Network Error")
      ) {
        errorMessage = "Error de conexión. Verifica tu internet";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error("Error de autenticación", {
        description: errorMessage,
        duration: 3000, // establecemos una duración de 3 segundos
        position: "top-center",
        action: {
          label: "Reintentar",
          onClick: () => {
            setEmail("");
            setPassword("");
          },
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Correo electrónico"
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          clearError("email");
        }}
        placeholder="tu@correo.com"
        disabled={isLoading}
        autoFocus
        autoComplete="username"
        error={errors.email}
      />

      <FormInput
        label="Contraseña"
        type="password"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          clearError("password");
        }}
        placeholder="••••••••"
        disabled={isLoading}
        autoComplete="current-password"
        error={errors.password}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-red-500 rounded border-gray-300 focus:ring-red-500"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-gray-700">Recordarme</span>
        </label>
        {/*Elimar en produccion el siguiente div ya que es para copiar los usuarios y contraseñas de prueba*/}

        <button
          type="button"
          onClick={() => navigate("/authentication/forgot-password")}
          className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50"
          disabled={isLoading}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center py-3 px-4 text-white bg-red-500 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Iniciando sesión...
          </>
        ) : (
          "Iniciar sesión"
        )}
      </Button>

      {/* Credenciales de prueba - Solo para desarrollo */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-blue-800">
            Credenciales de Prueba
          </h3>
        </div>

        <div className="grid gap-3">
          {/* Admin */}
          <div className="bg-white rounded-md p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-gray-700">
                Administrador
              </span>
              <button
                type="button"
                onClick={() =>
                  fillCredentials("admin2@admin.com", "Password123")
                }
                className="ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors">
                Usar
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">Email:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                  admin2@admin.com
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("admin2@admin.com", "email", "admin")
                  }
                  className="p-1 hover:bg-gray-200 rounded transition-colors">
                  {copiedItems["admin-email"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">Pass:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                  Password123
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("Password123", "password", "admin")
                  }
                  className="p-1 hover:bg-gray-200 rounded transition-colors">
                  {copiedItems["admin-password"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructor */}
          <div className="bg-white rounded-md p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium text-gray-700">
                Instructor
              </span>
              <button
                type="button"
                onClick={() =>
                  fillCredentials("test.instructor@test.com", "Password123")
                }
                className="ml-auto text-xs bg-purple-500 text-white px-2 py-1 rounded hover:bg-purple-600 transition-colors">
                Usar
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">Email:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                  test.instructor@test.com
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      "test.instructor@test.com",
                      "email",
                      "instructor"
                    )
                  }
                  className="p-1 hover:bg-gray-200 rounded transition-colors">
                  {copiedItems["instructor-email"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">Pass:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                  Password123
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("Password123", "password", "instructor")
                  }
                  className="p-1 hover:bg-gray-200 rounded transition-colors">
                  {copiedItems["instructor-password"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Estudiante */}
          <div className="bg-white rounded-md p-3 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-gray-700">
                Estudiante
              </span>
              <button
                type="button"
                onClick={() =>
                  fillCredentials("student@test.com", "Password123")
                }
                className="ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors">
                Usar
              </button>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">Email:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                  student@test.com
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("student@test.com", "email", "student")
                  }
                  className="p-1 hover:bg-gray-200 rounded transition-colors">
                  {copiedItems["student-email"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-12">Pass:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">
                  Password123
                </code>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard("Password123", "password", "student")
                  }
                  className="p-1 hover:bg-gray-200 rounded transition-colors">
                  {copiedItems["student-password"] ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-blue-600 mt-2 text-center">
          💡 Haz clic en "Usar" para llenar automáticamente los campos o usa los
          botones de copiar
        </p>
      </div>
    </form>
  );
}
