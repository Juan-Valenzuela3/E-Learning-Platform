import api from '../api';

/**
 * Valida un token JWT usando header Authorization y maneja retries/errores
 * @param {string} token - Token JWT a validar
 * @param {number} retries - Número de reintentos en caso de error de red
 * @returns {Promise<{isValid: boolean, username: string|null, role: string|null}>}
 */
export const useTokenValidation = async (token, retries = 1) => {
  if (!token) {
    console.error('No se proporcionó token');
    return { isValid: false, username: null, role: null };
  }

  try {
    const response = await api.get('/auth/validate', {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000, // Evita que la petición quede colgada
      validateStatus: (status) => status < 500 // No lanzar excepción para 4xx
    });

    // Token válido
    if (response.status === 200 && response.data.valid === true) {
      return {
        isValid: true,
        username: response.data.username || null,
        role: response.data.role || null
      };
    }

    // Token inválido o expirado
    if (response.status === 401) {
      console.warn('Token inválido o expirado');
      return { isValid: false, username: null, role: null };
    }

    // Otros códigos inesperados
    console.error('Respuesta inesperada del servidor', response.status, response.data);
    return { isValid: false, username: null, role: null };

  } catch (error) {
    console.error('Error al validar el token:', error.message);

    // Reintentar solo si queda algún retry
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR')) {
      console.log('Reintentando validación del token...');
      return validateToken(token, retries - 1);
    }

    return { isValid: false, username: null, role: null };
  }
};

/**
 * Decodifica el payload del JWT sin validar la firma
 * @param {string} token
 * @returns {Object|null}
 */
export const decodeJWTPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Error al decodificar token:', err);
    return null;
  }
};
