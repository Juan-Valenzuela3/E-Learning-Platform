import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "@/shared/hooks/useAuth";
import FormInput from "@/ui/FormInput";
import Toast from "@/ui/Toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastInfo, setToastInfo] = useState({ show: false, message: "", type: "info" });

  const { login, isAuthenticated, role } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname;
      if (from && from !== '/login') {
        navigate(from, { replace: true });
        return;
      }
      // Go directly to the correct dashboard to avoid hitting public '/'
      navigate(role === 'teacher' ? '/teacher/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Por favor ingresa tu correo y contraseña");
      setToastInfo({ show: true, message: "Por favor ingresa tu correo y contraseña", type: "error" });
      return;
    }

    setLoading(true);
    setError("");
    setToastInfo({ show: true, message: "Iniciando sesión...", type: "info" });

    try {
      const user = await login(email, password);
      if (user && user.token) {
        setToastInfo({ show: true, message: "¡Ingreso exitoso!", type: "success" });
        // Navigate immediately based on returned role to avoid landing page
        const target = user.role === 'teacher' ? '/teacher/dashboard' : '/dashboard';
        navigate(target, { replace: true });
      } else {
        throw new Error("La autenticación falló. Por favor intenta de nuevo.");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message ||
        err.message ||
        "Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.";
      setError(errorMessage);
      setToastInfo({ show: true, message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput
          label="Correo electrónico"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          disabled={loading}
        />
        <FormInput
          label="Contraseña"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          disabled={loading}
        />

        <button
          type="submit"
          className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 mt-4"

        >
          Iniciar Sesión
        </button>
      </form>

      <Toast
        show={toastInfo.show}
        message={toastInfo.message}
        type={toastInfo.type}
        onClose={() => setToastInfo(prev => ({ ...prev, show: false }))}
      />
    </>
  );
}