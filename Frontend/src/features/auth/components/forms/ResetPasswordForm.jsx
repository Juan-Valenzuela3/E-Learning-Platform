import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/ui/Button";
import { toast } from "sonner";
import FormInput from "@/ui/FormInput";
// import api from "@/services/api"; // TODO: Descomentar cuando se implemente el endpoint
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState(""); // eslint-disable-line no-unused-vars

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("Token de recuperación no válido");
      navigate("/authentication/login");
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams, navigate]);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      isValid: minLength && hasUppercase && hasLowercase && hasNumber,
    };
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validaciones
      if (!passwordValidation.isValid) {
        toast.error("La contraseña no cumple con los requisitos");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }

      // TODO: Implementar endpoint en el backend
      // await api.post("/auth/reset-password", {
      //   token,
      //   newPassword: password,
      // });

      // Simulación temporal - mostrar mensaje de funcionalidad no disponible
      toast.info(
        "Funcionalidad de restablecimiento de contraseña no disponible temporalmente. Contacta al administrador."
      );

      // Simular éxito para mostrar la UI
      setIsSuccess(true);
    } catch (err) {
      console.error("Error en reset-password:", err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error al restablecer la contraseña";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/authentication/login");
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ¡Contraseña restablecida!
        </h3>

        <p className="text-sm text-gray-600 mb-6">
          Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar
          sesión con tu nueva contraseña.
        </p>

        <Button
          onClick={handleBackToLogin}
          className="w-full flex justify-center py-3 px-4 text-white bg-red-500 rounded-md hover:bg-red-600">
          Ir al inicio de sesión
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Restablecer contraseña
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Ingresa tu nueva contraseña para completar el proceso de recuperación.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FormInput
            label="Nueva contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
            disabled={isLoading}
            autoFocus
            autoComplete="new-password"
            required
          />

          {/* Validaciones de contraseña */}
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-600">
              La contraseña debe contener:
            </p>
            <ul className="text-xs space-y-1">
              <li
                className={`flex items-center ${
                  password.length > 0
                    ? passwordValidation.minLength
                      ? "text-green-600"
                      : "text-red-500"
                    : "text-gray-500"
                }`}>
                {passwordValidation.minLength ? "✓ " : "• "}
                Mínimo 8 caracteres
              </li>
              <li
                className={`flex items-center ${
                  password.length > 0
                    ? passwordValidation.hasUppercase
                      ? "text-green-600"
                      : "text-red-500"
                    : "text-gray-500"
                }`}>
                {passwordValidation.hasUppercase ? "✓ " : "• "}
                Al menos una letra mayúscula
              </li>
              <li
                className={`flex items-center ${
                  password.length > 0
                    ? passwordValidation.hasLowercase
                      ? "text-green-600"
                      : "text-red-500"
                    : "text-gray-500"
                }`}>
                {passwordValidation.hasLowercase ? "✓ " : "• "}
                Al menos una letra minúscula
              </li>
              <li
                className={`flex items-center ${
                  password.length > 0
                    ? passwordValidation.hasNumber
                      ? "text-green-600"
                      : "text-red-500"
                    : "text-gray-500"
                }`}>
                {passwordValidation.hasNumber ? "✓ " : "• "}
                Al menos un número
              </li>
            </ul>
          </div>
        </div>

        <FormInput
          label="Confirmar nueva contraseña"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirma tu nueva contraseña"
          disabled={isLoading}
          autoComplete="new-password"
          required
        />

        {password && confirmPassword && password !== confirmPassword && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            Las contraseñas no coinciden
          </div>
        )}

        <Button
          type="submit"
          className="w-full flex justify-center py-3 px-4 text-white bg-red-500 rounded-md hover:bg-red-600"
          disabled={
            isLoading ||
            !passwordValidation.isValid ||
            password !== confirmPassword
          }>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
              Restableciendo...
            </>
          ) : (
            "Restablecer contraseña"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={handleBackToLogin}
          className="text-sm text-gray-600 hover:text-gray-800">
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
