import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Save,
  X,
  User,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import api from "@/services/api";

const NewUserPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    lastName: "",
    email: "",
    password: "",
    role: "STUDENT",
    isActive: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validaciones frontend
    if (!formData.userName || formData.userName.length < 2) {
      setError("El nombre de usuario debe tener al menos 2 caracteres.");
      setLoading(false);
      return;
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      setError("El apellido debe tener al menos 2 caracteres.");
      setLoading(false);
      return;
    }
    if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      setError("El email no es válido.");
      setLoading(false);
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }
    if (!formData.role || !["STUDENT", "INSTRUCTOR", "ADMIN"].includes(formData.role)) {
      setError("El rol seleccionado no es válido.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/users/register", formData);

      if (response.status === 200) {
        setSuccess(true);
        // Limpiar formulario
        setFormData({
          userName: "",
          lastName: "",
          email: "",
          password: "",
          role: "STUDENT",
          isActive: true,
        });

        // Redirigir después de 2 segundos
        setTimeout(() => {
          navigate("/admin/usuarios");
        }, 2000);
      }
    } catch (err) {
      // Mostrar errores de validación del backend si existen
      const backendMsg = err.response?.data?.errors?.[0]?.defaultMessage || err.response?.data?.message;
      setError(backendMsg || "Error al crear el usuario");
      console.error("Error creating user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/usuarios");
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "INSTRUCTOR":
        return "bg-blue-100 text-blue-800";
      case "STUDENT":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="w-4 h-4" />;
      case "INSTRUCTOR":
        return <User className="w-4 h-4" />;
      case "STUDENT":
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Nuevo Usuario
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Crear un nuevo usuario en el sistema
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Usuario creado exitosamente
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  El usuario ha sido creado correctamente. Redirigiendo a la
                  lista de usuarios...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al crear usuario
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="userName"
                  className="block text-sm font-medium text-gray-700">
                  Nombre *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    required
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Nombre del usuario"
                  />
                </div>
              </div>

              {/* Apellido */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700">
                  Apellido *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Apellido del usuario"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="usuario@ejemplo.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700">
                  Contraseña *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>

              {/* Rol */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700">
                  Rol *
                </label>
                <div className="mt-1">
                  <select
                    name="role"
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm">
                    <option value="STUDENT">Estudiante</option>
                    <option value="INSTRUCTOR">Instructor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
              </div>

              {/* Estado Activo */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="ml-2 block text-sm text-gray-900">
                  Usuario activo
                </label>
              </div>
            </div>

            {/* Preview del usuario */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Vista previa del usuario:
              </h4>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {formData.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {formData.userName} {formData.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{formData.email}</div>
                </div>
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(
                      formData.role
                    )}`}>
                    {getRoleIcon(formData.role)}
                    <span className="ml-1">
                      {formData.role === "STUDENT"
                        ? "Estudiante"
                        : formData.role === "INSTRUCTOR"
                        ? "Instructor"
                        : "Administrador"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Crear Usuario
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUserPage;
