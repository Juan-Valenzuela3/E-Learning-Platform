import api from "./api";
import { setToken, clearAuth } from "./api";

// Función helper para setUser
const setUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
};

// Configuración común para las peticiones de autenticación
const authConfig = {
    withCredentials: true, // Importante para manejar cookies de autenticación
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

/**
 * Inicia sesión de usuario
 * @param {Object} credentials - Credenciales de inicio de sesión
 * @param {string} credentials.email - Email del usuario
 * @param {string} credentials.password - Contraseña del usuario
 * @returns {Promise<Object>} Datos del usuario y token de autenticación
 */
export async function login({ email, password }) {
    try {
        // Limpiar tokens existentes
        localStorage.removeItem('token');

        // Realizar la petición de login
        const response = await api.post(
            '/auth/login',
            { email, password },
            authConfig
        );

      

        if (response.data?.token) {
            const { token, userId, userName, email, role, isActive } = response.data;

            // Almacenar el token y los datos del usuario
            setToken(token);
            setUser({
                id: userId,
                userName,
                email,
                role,
                isActive
            });

            // Actualizar las cabeceras por defecto de axios
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return response.data;
        }

        throw new Error('No se recibió un token de autenticación');
    } catch (error) {
        console.error('Error en el servicio de login:', error);

        let errorMessage = 'Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.';

        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Tiempo de espera agotado. Por favor, verifica tu conexión a internet.';
        } else if (error.code === 'ERR_NETWORK') {
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.response) {
            // The request was made and the server responded with a status code
            const { status, data } = error.response;

            if (status === 400) {
                errorMessage = data.message || 'Datos de entrada inválidos. Por favor, verifica la información proporcionada.';
            } else if (status === 401) {
                errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
            } else if (status === 403) {
                errorMessage = 'Acceso denegado: usuario inactivo o sin permisos';
            } else if (status === 500) {
                errorMessage = 'Error interno del servidor. Por favor, intente más tarde.';
            } else if (data?.message) {
                errorMessage = data.message;
            }
        } else if (error.request) {
            // The request was made but no response was received
            errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        }

        // Clear any partial authentication state
        clearAuth();

        throw new Error(errorMessage);
    }
}
