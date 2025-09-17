import api from "./api";
import { setupAuthInterceptor } from "./authInterceptor";

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean} true si el usuario está autenticado, false en caso contrario
 */
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Registra un nuevo usuario
 * @param {Object} userData - Datos del usuario a registrar
 * @param {string} userData.firstName - Nombre del usuario
 * @param {string} userData.lastName - Apellido del usuario
 * @param {string} userData.email - Email del usuario (debe ser único)
 * @param {string} userData.password - Contraseña del usuario (mínimo 6 caracteres)
 * @param {string} [userData.role=STUDENT] - Rol del usuario (STUDENT, INSTRUCTOR, ADMIN)
 * @returns {Promise<Object>} Datos del usuario registrado
 */
const register = async ({ firstName, lastName, email, password, role = 'STUDENT' }) => {
  try {
    console.log('=== REGISTRO: Datos enviados al backend ===');
    console.log({
      userName: firstName,
      lastName,
      email,
      password: '***',
      role
    });

    const response = await api.post('/api/users/register', {
      userName: firstName,
      lastName,
      email,
      password,
      role
    });

    console.log('=== REGISTRO: Respuesta del backend ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);

    // Si el registro es exitoso, hacemos login automáticamente
    if (response.data) {
      console.log('=== REGISTRO: Haciendo auto-login ===');
      return await login({ email, password });
    }
    
    return response.data;
  } catch (error) {
    console.error('=== REGISTRO: Error ===', error);
    const errorMessage = error.response?.data?.message || 'Error al registrar el usuario';
    throw new Error(errorMessage);
  }
};

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales de inicio de sesión
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const login = async ({ email, password }) => {
  try {
    console.log('=== LOGIN: Enviando credenciales ===');
    console.log({ email, password: '***' });

    const response = await api.post('/auth/login', { email, password });
    
    console.log('=== LOGIN: Respuesta del backend ===');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (!response.data?.token) {
      throw new Error('No se recibió el token de autenticación');
    }

    const { token, refreshToken, user } = response.data;
    
    console.log('=== LOGIN: Datos extraídos ===');
    console.log('Token:', token ? '***' + token.slice(-10) : 'No token');
    console.log('User data:', user);
    console.log('User role:', user?.role);
    
    // Guardar tokens y datos del usuario
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    const userData = {
      id: user?.id || response.data.userId,
      userName: user?.userName || response.data.userName,
      email: user?.email || email,
      role: user?.role || response.data.role,
      isActive: user?.isActive ?? true
    };
    
    console.log('=== LOGIN: Datos del usuario final ===');
    console.log('userData:', userData);
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Configurar interceptor de autenticación
    setupAuthInterceptor(logout);
    
    return userData;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
    throw new Error(errorMessage);
  }
};

/**
 * Cierra la sesión del usuario
 * @returns {void}
 */
const logout = () => {
  console.log('=== LOGOUT: Iniciando logout ===');
  console.log('Ubicación actual:', window.location.pathname);
  
  // Limpiar datos de autenticación
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  console.log('=== LOGOUT: Datos limpiados del localStorage ===');
  
  // Redirigir al login solo si no estamos ya en la página de inicio
  if (window.location.pathname !== '/') {
    console.log('=== LOGOUT: Redirigiendo a / ===');
    window.location.href = '/';
  } else {
    console.log('=== LOGOUT: Ya estamos en /, no redirigir ===');
  }
};

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @returns {Promise<Object|null>} Datos del usuario autenticado o null si no está autenticado
 */
const getCurrentUser = async () => {
  try {
    // Primero intentamos obtener los datos del localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('=== USUARIO DESDE LOCALSTORAGE ===');
      console.log('Usuario:', parsedUser);
      console.log('Rol:', parsedUser.role);
      return parsedUser;
    }

    // Si no hay datos en localStorage, los solicitamos al servidor
    console.log('=== SOLICITANDO PERFIL AL SERVIDOR ===');
    const response = await api.get('/api/users/profile');
    
    if (response.data) {
      console.log('=== RESPUESTA DEL SERVIDOR ===');
      console.log('Datos del servidor:', response.data);
      console.log('Rol del servidor:', response.data.role);
      
      // Guardamos los datos en localStorage para futuras solicitudes
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('=== ERROR EN getCurrentUser ===', error);
    // Si hay un error (por ejemplo, token inválido), cerramos la sesión
    logout();
    return null;
  }
};

/**
 * Valida si el token actual es válido
 * @returns {Promise<Object>} {valid: boolean, username?: string}
 */
const validateToken = async () => {
  const token = localStorage.getItem('token');
  if (!token) return { valid: false };

  try {
    // Verificar formato básico del token
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      logout();
      return { valid: false };
    }

    // Verificar expiración local
    try {
      const tokenData = JSON.parse(atob(tokenParts[1]));
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        logout();
        return { valid: false };
      }
    } catch (e) {
      // Si hay un error al decodificar, consideramos el token inválido
      logout();
      return { valid: false };
    }

    // CRÍTICO: Validar con el servidor usando query parameter según AuthController.java
    // NO usar header Authorization, sino query parameter ?token=
    const response = await api.get(`/auth/validate?token=${encodeURIComponent(token)}`, {
      // Temporalmente remover el header Authorization para esta llamada específica
      headers: {
        Authorization: undefined
      }
    });
    return response.data || { valid: false };
  } catch (error) {
    console.error('Error validando token:', error);
    // Si hay un error en la validación, cerramos sesión
    logout();
    return { valid: false };
  }
};

/**
 * Verifica si un token es válido
 * @param {string} token - Token a verificar
 * @returns {Promise<boolean>} true si el token es válido, false en caso contrario
 */
const verifyToken = async (token) => {
  try {
    if (!token) return false;
    
    // CRÍTICO: Enviar token como query parameter según AuthController.java
    // NO usar header Authorization, sino query parameter ?token=
    const response = await api.get(`/auth/validate?token=${encodeURIComponent(token)}`, {
      // Temporalmente remover el header Authorization para esta llamada específica
      headers: {
        Authorization: undefined
      }
    });
    
    return response.data?.valid || false;
  } catch (error) {
    console.error('Error verificando token:', error);
    return false;
  }
};

/**
 * Actualiza el perfil del usuario actual
 * @param {Object} userData - Datos actualizados del usuario
 * @returns {Promise<Object>} Datos actualizados del usuario
 */
const updateProfile = async (userData) => {
  try {
    const response = await api.put('/api/users/profile', userData);
    
    // Actualizar datos del usuario en localStorage
    if (response.data) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene el token de autenticación actual
 * @returns {string|null} Token de autenticación o null si no existe o es inválido
 */
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  // Verificar si el token está a punto de expirar
  try {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const tokenData = JSON.parse(atob(tokenParts[1]));
      const now = Date.now() / 1000;
      
      // Si el token expira en menos de 5 minutos, considerarlo inválido
      if (tokenData.exp && tokenData.exp - now < 300) {
        logout();
        return null;
      }
    }
  } catch (e) {
    return null;
  }
  
  return token;
};

/**
 * Establece el token de autenticación
 * @param {string} token - Token de autenticación
 * @param {string} [refreshToken] - Token de actualización (opcional)
 * @returns {void}
 */
const setToken = (token, refreshToken) => {
  if (token) {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  } else {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Servicio de autenticación
 */
const authService = {
  isAuthenticated,
  verifyToken,
  register,
  login,
  logout,
  getCurrentUser,
  validateToken,
  updateProfile,
  getToken,
  setToken,
};

export default authService;
