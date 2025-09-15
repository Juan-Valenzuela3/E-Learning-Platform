// src/components/RegisterForm.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { GraduationCap, BriefcaseBusiness, Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import FormInput from "../../../../ui/FormInput";
import { useState } from 'react';

// Validación mejorada
const registerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'El nombre solo puede contener letras'),
    
  lastName: yup
    .string()
    .required('El apellido es obligatorio')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede tener más de 50 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/, 'El apellido solo puede contener letras'),
    
  email: yup
    .string()
    .email('Ingresa un correo electrónico válido')
    .required('El correo es obligatorio')
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
      'Formato de correo inválido'
    ),
    
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])/,
      'Debe contener al menos una minúscula'
    )
    .matches(
      /^(?=.*[A-Z])/,
      'Debe contener al menos una mayúscula'
    )
    .matches(
      /^(?=.*[0-9])/,
      'Debe contener al menos un número'
    ),
    
  confirmPassword: yup
    .string()
    .required('Por favor confirma tu contraseña')
    .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
    
  accountType: yup
    .string()
    .oneOf(['student', 'teacher'], 'Selecciona un tipo de cuenta')
    .required('El tipo de cuenta es obligatorio'),
    
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'Debes aceptar los términos y condiciones para continuar')
    .required('Debes aceptar los términos y condiciones'),
    
  receiveUpdates: yup.boolean()
});

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const { register: registerUser, setError: setAuthError } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { accountType: 'student', acceptTerms: false, receiveUpdates: false }
  });
  
  const password = watch('password', '');
  
  // Validaciones de contraseña en tiempo real
  const passwordValidations = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  };

  const onSubmit = async (formData) => {
    setIsRegistering(true);
    setAuthError(null); // Limpiar errores previos

    try {
      // Mapear el tipo de cuenta al formato de rol esperado por el backend
      const roleMap = {
        'student': 'STUDENT',
        'teacher': 'INSTRUCTOR'
      };

      // Enviar los datos al contexto de autenticación
      const result = await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: roleMap[formData.accountType] || 'STUDENT'
      });

      if (result && result.success) {
        toast.success('¡Registro exitoso! Bienvenido a EduPlatform.');

        // Si hay auto-login, redirigir al dashboard según el rol
        if (result.autoLogin) {
          const role = roleMap[formData.accountType] || 'STUDENT';
          const redirectPath = role === 'INSTRUCTOR' ? '/teacher/dashboard' : '/dashboard';
          
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 1500);
        } else {
          // Si no hay auto-login, redirigir al login
          setTimeout(() => {
            navigate('/auth', { state: { from: 'register' } });
          }, 1500);
        }
      } else {
        throw new Error(result.error || 'Error desconocido al registrar');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar la cuenta';
      toast.error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleAccountTypeChange = (type) => reset({ ...watch(), accountType: type });

  return (
    <div className="flex flex-col items-center w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className='col-span-1'>
            <FormInput 
              label="Nombre" 
              type="text" 
              error={errors.firstName?.message} 
              {...register('firstName')} 
              placeholder="Ej: Juan"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>
          <div>
            <FormInput 
              label="Apellido" 
              type="text" 
              error={errors.lastName?.message} 
              {...register('lastName')}
              placeholder="Ej: Pérez"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <FormInput 
            label="Correo electrónico" 
            type="email" 
            error={errors.email?.message} 
            {...register('email')} 
            placeholder="ejemplo@correo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div>
              <FormInput 
                label="Contraseña" 
                type="password" 
                error={errors.password?.message} 
                {...register('password')} 
                placeholder="Crea una contraseña segura"
              />
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">La contraseña debe contener:</p>
                <ul className="text-xs space-y-1">
                  <li className={`flex items-center ${password.length > 0 ? (passwordValidations.minLength ? 'text-green-600' : 'text-red-500') : 'text-gray-500'}`}>
                    {passwordValidations.minLength ? '✓ ' : '• '}
                    Mínimo 8 caracteres
                  </li>
                  <li className={`flex items-center ${password.length > 0 ? (passwordValidations.hasUppercase ? 'text-green-600' : 'text-red-500') : 'text-gray-500'}`}>
                    {passwordValidations.hasUppercase ? '✓ ' : '• '}
                    Al menos una letra mayúscula
                  </li>
                  <li className={`flex items-center ${password.length > 0 ? (passwordValidations.hasLowercase ? 'text-green-600' : 'text-red-500') : 'text-gray-500'}`}>
                    {passwordValidations.hasLowercase ? '✓ ' : '• '}
                    Al menos una letra minúscula
                  </li>
                  <li className={`flex items-center ${password.length > 0 ? (passwordValidations.hasNumber ? 'text-green-600' : 'text-red-500') : 'text-gray-500'}`}>
                    {passwordValidations.hasNumber ? '✓ ' : '• '}
                    Al menos un número
                  </li>
                </ul>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <FormInput 
              label="Confirmar contraseña" 
              type="password" 
              error={errors.confirmPassword?.message} 
              {...register('confirmPassword')} 
              placeholder="Vuelve a escribir tu contraseña"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-4 w-full">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-2">Tipo de cuenta <span className="text-red-500">*</span></p>
            <input type="hidden" {...register('accountType')} value={watch('accountType')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => handleAccountTypeChange('student')} 
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  watch('accountType') === 'student' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <GraduationCap className="mr-2" /> Estudiante
              </button>
              <button 
                type="button" 
                onClick={() => handleAccountTypeChange('teacher')} 
                className={`flex items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  watch('accountType') === 'teacher' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <BriefcaseBusiness className="mr-2" /> Instructor
              </button>
            </div>
            {errors.accountType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.accountType.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-2 w-full">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                {...register('acceptTerms')}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptTerms" className="font-medium text-gray-700">
                Acepto los{' '}
                <a href="/terminos" className="text-red-600 hover:text-red-500 underline">
                  Términos y Condiciones
                </a>{' '}
                <span className="text-red-500">*</span>
              </label>
              {errors.acceptTerms && (
                <p className="mt-1 text-red-600">{errors.acceptTerms.message}</p>
              )}
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                id="receiveUpdates"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                {...register('receiveUpdates')}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="receiveUpdates" className="font-medium text-gray-700">
                Deseo recibir notificaciones y actualizaciones por correo electrónico
              </label>
              <p className="text-gray-500 text-xs mt-1">
                Podrás cambiar esta opción en cualquier momento en la configuración de tu cuenta.
              </p>
            </div>
          </div>
        </div>
        {/* Auth errors are now shown via toast */}
        <button 
          type="submit" 
          disabled={isRegistering} 
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isRegistering ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" /> 
              Registrando...
            </>
          ) : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}