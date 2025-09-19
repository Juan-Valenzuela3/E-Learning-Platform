import api from './api';

/**
 * Obtiene los datos del usuario actualmente autenticado
 * @param {boolean} forceRefresh - Si es true, fuerza la actualización desde el servidor
 * @returns {Promise<Object>} Datos del usuario autenticado
 */
const getCurrentUser = async () => {
  try {
    // Llamada relativa, para que el proxy de Vite funcione
    const response = await api.get('/api/users/profile');

    if (response?.data) {
      return {
        id: response.data.id,
        userName: response.data.userName,
        lastName: response.data.lastName,
        email: response.data.email,
        role: response.data.role,
        isActive: response.data.isActive,
        profileImageUrl: response.data.profileImageUrl,
        createdAt: response.data.createdAt,
        updatedAt: response.data.updatedAt
      };
    }

    throw { message: 'No se recibieron datos del usuario' };
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Error al obtener el perfil del usuario';
    console.error('Error al cargar el perfil del usuario:', message);
    throw { message };
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

    return response.data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || 'Error al actualizar el perfil';
    console.error('Error al actualizar el perfil:', message);
    throw { message };
  }
};

/**
 * Actualiza la contraseña del usuario
 * @param {string} currentPassword - Contraseña actual
 * @param {string} newPassword - Nueva contraseña
 * @returns {Promise<Object>} Resultado de la operación
 */
const updatePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await api.put('/api/users/me/password', {
      currentPassword,
      newPassword
    });
    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
      data: response.data
    };
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);

    if (error.response?.status === 400) {
      throw new Error('La contraseña actual es incorrecta');
    }
    if (error.response?.status === 401) {
      throw new Error('Debes iniciar sesión para cambiar la contraseña');
    }
    if (error.response?.status === 403) {
      throw new Error('No tienes permiso para cambiar la contraseña');
    }

    const message = error?.response?.data?.message || error?.message || 'Error al actualizar la contraseña';
    throw new Error(message);
  }
};



export default {
  getCurrentUser,
  updateProfile,
  updatePassword
};
