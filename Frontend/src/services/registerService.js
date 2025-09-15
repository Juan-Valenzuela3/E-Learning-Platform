import api from "./api";
//import { setToken, setUser } from './authStorage';

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.firstName - Nombre del usuario
 * @param {string} userData.lastName - Apellido del usuario
 * @param {string} userData.email - Email del usuario (debe ser único)
 * @param {string} userData.password - Contraseña del usuario (mínimo 6 caracteres)
 * @param {string} userData.role - Rol del usuario (STUDENT, INSTRUCTOR, ADMIN)
 * @returns {Promise<Object>} Datos del usuario registrado
 */
// Aceptar tanto userName como firstName para mayor compatibilidad
const register = async ({ userName, firstName, lastName, email, password, role = 'STUDENT' }) => {
  try {
    // Validar datos requeridos
    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    // Mapear firstName a userName si solo se proporciona firstName
    const userData = {
      userName: userName || firstName, // Usar userName si está definido, si no, usar firstName
      lastName: lastName || '', // Hacer lastName opcional
      email: email.trim().toLowerCase(),
      password,
      role: role || 'STUDENT' // Valor por defecto
    };
    
    console.log('Enviando datos de registro...');
    
    // Usar la ruta correcta del backend según API.md
    const response = await api.post('/api/users/register', userData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.data) {
      throw new Error('No se recibieron datos en la respuesta del servidor');
    }

    console.log('Registro exitoso');
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error.message);  
    console.error({
      message: error.message,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      },
      request: error.request,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers
      }
    });

    let errorMessage = 'Error al registrar el usuario';
    let statusCode = error.response?.status || 500;
    let validationErrors = [];

    if (error.response?.data) {
      const errorData = error.response.data;
      errorMessage = errorData.message || errorMessage;
      
      if (errorData.errors) {
        validationErrors = errorData.errors.map(err => ({
          field: err.path || 'general',
          message: err.msg || 'Error de validación'
        }));
        
        console.error('Errores de validación en el formulario');
      } else if (errorData.error) {
        // Algunas API devuelven el error directamente en 'error'
        errorMessage = errorData.error;
      }
    } else if (error.request) {
      errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
    }
    
    const errorToThrow = new Error(errorMessage);
    errorToThrow.status = statusCode;
    errorToThrow.errors = validationErrors;
    
    throw errorToThrow;
  }
};

/**
 * Verifica si un email ya está registrado
 * @param {string} email - Email a verificar
 * @returns {Promise<boolean>} true si el email ya está en uso, false en caso contrario
 */
const checkEmailAvailability = async (email) => {
  try {
    // La API devuelve 200 si el email está disponible, 409 si ya existe
    await api.get(`/api/users/check-email?email=${encodeURIComponent(email)}`);
    return true; // Si no hay error, el email está disponible
  } catch (error) {
    return error.response?.status === 409; // 409 Conflict indica que el email ya está en uso
  }
};

export { register, checkEmailAvailability };
