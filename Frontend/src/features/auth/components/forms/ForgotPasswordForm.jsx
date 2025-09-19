import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/ui/Button";
import { toast } from "sonner";
import FormInput from "@/ui/FormInput";
// import api from "@/services/api"; // TODO: Descomentar cuando se implemente el endpoint
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validación básica
      if (!email.includes("@")) {
        toast.error("Por favor ingresa un correo electrónico válido");
        return;
      }

      // TODO: Implementar endpoint en el backend
      // await api.post("/auth/forgot-password", { email: email.trim() });

      // Simulación temporal - mostrar mensaje de funcionalidad no disponible
      toast.info(
        "Funcionalidad de recuperación de contraseña no disponible temporalmente. Contacta al administrador."
      );

      // Simular envío exitoso para mostrar la UI
      setIsEmailSent(true);
    } catch (err) {
      console.error("Error en forgot-password:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al enviar el email de recuperación";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/authentication/login");
  };

  if (isEmailSent) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Mail className="h-6 w-6 text-green-600" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Email enviado correctamente
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
          Revisa tu bandeja de entrada y sigue las instrucciones para
          restablecer tu contraseña.
        </p>

        <div className="space-y-3">
          <Button
            onClick={handleBackToLogin}
            className="w-full flex justify-center py-3 px-4 text-white bg-red-500 rounded-md hover:bg-red-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio de sesión
          </Button>

          <button
            onClick={() => setIsEmailSent(false)}
            className="text-sm text-gray-500 hover:text-gray-700">
            ¿No recibiste el email? Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          No te preocupes, te enviaremos un enlace para restablecer tu
          contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          disabled={isLoading}
          autoFocus
          autoComplete="email"
          required
        />

        <Button
          type="submit"
          className="w-full flex justify-center py-3 px-4 text-white bg-red-500 rounded-md hover:bg-red-600"
          disabled={isLoading || !email}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Enviando...
            </>
          ) : (
            "Enviar enlace de recuperación"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleBackToLogin}
          className="text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center mx-auto">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
