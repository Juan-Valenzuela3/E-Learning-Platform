import { useState } from "react";
import FormInput from "../../../../ui/FormInput";

import {
  GraduationCap,
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import mockAuthService from "@/interfaces/api/__mocks__/mockAuthService";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "student", // align with roles: 'student' | 'teacher'
    acceptTerms: false,
    receiveUpdates: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (banner.message) setBanner({ type: '', message: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio';
    if (!form.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.password) newErrors.password = 'La contraseña es obligatoria';
    else if (form.password.length < 8) newErrors.password = 'Mínimo 8 caracteres';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirma la contraseña';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!['student', 'teacher'].includes(form.accountType)) newErrors.accountType = 'Selecciona un tipo de cuenta';
    if (!form.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setBanner({ type: 'error', message: 'Por favor corrige los errores del formulario.' });
      return;
    }
    try {
      setLoading(true);
      await mockAuthService.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        role: form.accountType === 'teacher' ? 'teacher' : 'student',
        receiveUpdates: form.receiveUpdates,
      });
      setBanner({ type: 'success', message: 'Registro exitoso. Redirigiendo al inicio de sesión…' });
      setTimeout(() => navigate('/login', { replace: true, state: { showLogin: true } }), 800);
    } catch (err) {
      const msg = err?.response?.data?.message || 'No se pudo completar el registro';
      setBanner({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountTypeChange = (type) => {
    setForm((prevForm) => ({
      ...prevForm,
      accountType: type,
    }));
    if (errors.accountType) setErrors(prev => ({ ...prev, accountType: undefined }));
  };

  const accountTypes = [
    {
      type: "student",
      label: "Estudiante",
      description: "Accede a cursos y materiales de aprendizaje",
      icon: <GraduationCap />,
    },
    {
      type: "teacher",
      label: "Instructor",
      description: "Crea y gestiona cursos educativos",
      icon: <BriefcaseBusiness />,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {banner.message && (
        <div className={`p-3 rounded-md text-sm ${banner.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {banner.message}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Nombre"
          name="firstName"
          type="text"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Tu nombre"
          error={!!errors.firstName}
          errorMessage={errors.firstName}
          disabled={loading}
        />
        <FormInput
          label="Apellido"
          name="lastName"
          type="text"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Tu apellido"
          error={!!errors.lastName}
          errorMessage={errors.lastName}
          disabled={loading}
        />
      </div>

      <FormInput
        label="Correo Electrónico"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="tu@email.com"
        error={!!errors.email}
        errorMessage={errors.email}
        disabled={loading}
      />
      <FormInput
        label="Contraseña"
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Mínimo 8 caracteres"
        error={!!errors.password}
        errorMessage={errors.password}
        disabled={loading}
      />
      <FormInput
        label="Confirmar Contraseña"
        name="confirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirma tu contraseña"
        error={!!errors.confirmPassword}
        errorMessage={errors.confirmPassword}
        disabled={loading}
      />

      {/* Sección para el tipo de cuenta */}
      <div className="text-left pt-4">
        <p className="block text-gray-700 font-medium mb-2">Tipo de Cuenta</p>
        <div className="grid grid-cols-3 gap-4">
          {accountTypes.map((accType) => (
            <div
              key={accType.type}
              onClick={() => handleAccountTypeChange(accType.type)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${form.accountType === accType.type
                ? "border-black bg-black text-white shadow-lg"
                : "border-gray-300 hover:border-black"
                }`}>
              <div className="flex justify-center text-4xl mb-2">
                {accType.icon}
              </div>
              <p className="font-semibold text-sm">{accType.label}</p>
              <p className="text-xs">{accType.description}</p>
            </div>
          ))}
        </div>
        {errors.accountType && (
          <p className="mt-2 text-sm text-red-600">{errors.accountType}</p>
        )}
      </div>

      {/* Checkboxes de Términos y Condiciones */}
      <div className="flex flex-col space-y-2 text-left text-sm">
        <label className="flex items-center text-gray-700">
          <input
            type="checkbox"
            name="acceptTerms"
            checked={form.acceptTerms}
            onChange={handleChange}
            className="mr-2"
            required
            disabled={loading}
          />
          <a href="#">
            Acepto los{" "}
            <span className="text-red-500 font-medium ml-1">
              Términos de Servicio
            </span>
          </a>{" "}
          <span className="ml-1"> y </span>
          <a href="#">
            <span className="text-red-500 font-medium ml-1">
              Política de Privacidad
            </span>
          </a>
        </label>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms}</p>
        )}
        <label className="flex items-center text-gray-700">
          <input
            type="checkbox"
            name="receiveUpdates"
            checked={form.receiveUpdates}
            onChange={handleChange}
            className="mr-2"
            disabled={loading}
          />
          Quiero recibir actualizaciones y noticias por correo electrónico
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full text-white py-3 rounded-lg transition-colors duration-200 mt-4 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-gray-800'}`}>
        {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
      </button>

    </form>
  );
}
