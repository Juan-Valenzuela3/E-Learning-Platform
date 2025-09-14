import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/ui/Button";
import { toast } from 'sonner';
import FormInput from "@/ui/FormInput";
import api from '@/services/api';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validación básica
      if (!email.includes("@")) throw new Error("Correo inválido");
      if (password.length < 8) throw new Error("La contraseña debe tener al menos 8 caracteres");

      // Llamada al backend
      const response = await api.post("/auth/login", { email: email.trim(), password, rememberMe });

      if (!response.data.token) throw new Error("No se recibió el token de autenticación");

      const userData = {
        token: response.data.token,
        user: {
          id: response.data.userId,
          name: response.data.userName,
          email: response.data.email,
          role: response.data.role,
          isActive: response.data.isActive
        }
      };

      // Loguear al usuario mediante AuthContext
      const loginResult = await login(userData);

      if (loginResult.success) {
        toast.success("¡Inicio de sesión exitoso!");

        // Redirigir según rol (mapear 'instructor' a 'teacher' para compatibilidad)
        const role = response.data.role.toLowerCase();
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "teacher" || role === "instructor") {
          navigate("/teacher/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        throw new Error(loginResult.error || "Error al iniciar sesión");
      }

    } catch (err) {
      console.error("Error en login:", err);
      const msg = err.response?.data?.message || err.message || "Error al iniciar sesión";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormInput
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="tu@correo.com"
        disabled={isLoading}
        autoFocus
        autoComplete="username"
      />

      <FormInput
        label="Contraseña"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="••••••••"
        disabled={isLoading}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-red-500 rounded border-gray-300 focus:ring-red-500"
          />
          <span className="ml-2 text-sm text-gray-700">Recordarme</span>
        </label>

        <a href="/auth/forgot-password" className="text-sm font-medium text-red-500 hover:text-red-600">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center py-3 px-4 text-white bg-red-500 rounded-md hover:bg-red-600"
        disabled={isLoading}
      >
        {isLoading ? <><Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />Iniciando sesión...</> : "Iniciar sesión"}
      </Button>
    </form>
  );
}
