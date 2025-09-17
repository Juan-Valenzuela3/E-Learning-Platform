// src/services/userService.js
import api from './api';

/**
 * Servicio para operaciones relacionadas con usuarios
 * Maneja todas las operaciones de perfil y gestión de usuarios
 */
class UserService {
  /**
   * Obtiene el perfil del usuario actual
   * @returns {Promise<Object>} Datos del perfil
   */
  async getProfile() {
    try {
      const response = await api.get('/api/users/profile');
      return {
        success: true,
        user: response.data
      };

    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Actualiza el perfil del usuario
   * @param {Object} userData - Datos del usuario a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/api/users/profile', userData);

      // Actualizar datos en localStorage si es necesario
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }

      return {
        success: true,
        user: response.data,
        message: 'Perfil actualizado exitosamente'
      };

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  /**
   * Cambia la contraseña del usuario
   * @param {string} currentPassword - Contraseña actual
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Resultado del cambio
   */
  async changePassword(currentPassword, newPassword) {
    try {
      await api.put('/api/users/change-password', {
        currentPassword,
        newPassword
      });

      return {
        success: true,
        message: 'Contraseña cambiada exitosamente'
      };

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  /**
   * Sube una imagen de perfil
   * @param {File} imageFile - Archivo de imagen
   * @returns {Promise<Object>} URL de la imagen subida
   */
  async uploadProfileImage(imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/api/users/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        imageUrl: response.data.imageUrl,
        message: 'Imagen de perfil actualizada exitosamente'
      };

    } catch (error) {
      console.error('Error al subir imagen de perfil:', error);
      throw error;
    }
  }

  /**
   * Obtiene el historial de pagos del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} Lista de pagos
   */
  async getPaymentHistory(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/api/users/payment-history?${params.toString()}`);
      return {
        success: true,
        payments: response.data.payments || response.data,
        pagination: response.data.pagination
      };

    } catch (error) {
      console.error('Error al obtener historial de pagos:', error);
      throw error;
    }
  }

  /**
   * Obtiene las notificaciones del usuario
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} Lista de notificaciones
   */
  async getNotifications(filters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.read) params.append('read', filters.read);
      if (filters.type) params.append('type', filters.type);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/api/users/notifications?${params.toString()}`);
      return {
        success: true,
        notifications: response.data.notifications || response.data,
        pagination: response.data.pagination
      };

    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  /**
   * Marca una notificación como leída
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async markNotificationAsRead(notificationId) {
    try {
      await api.put(`/api/users/notifications/${notificationId}/read`);
      return {
        success: true,
        message: 'Notificación marcada como leída'
      };

    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      throw error;
    }
  }

  /**
   * Marca todas las notificaciones como leídas
   * @returns {Promise<Object>} Resultado de la actualización
   */
  async markAllNotificationsAsRead() {
    try {
      await api.put('/api/users/notifications/read-all');
      return {
        success: true,
        message: 'Todas las notificaciones marcadas como leídas'
      };

    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
      throw error;
    }
  }

  /**
   * Obtiene las preferencias del usuario
   * @returns {Promise<Object>} Preferencias del usuario
   */
  async getPreferences() {
    try {
      const response = await api.get('/api/users/preferences');
      return {
        success: true,
        preferences: response.data
      };

    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      throw error;
    }
  }

  /**
   * Actualiza las preferencias del usuario
   * @param {Object} preferences - Preferencias a actualizar
   * @returns {Promise<Object>} Preferencias actualizadas
   */
  async updatePreferences(preferences) {
    try {
      const response = await api.put('/api/users/preferences', preferences);
      return {
        success: true,
        preferences: response.data,
        message: 'Preferencias actualizadas exitosamente'
      };

    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      throw error;
    }
  }

  /**
   * Elimina la cuenta del usuario
   * @param {string} password - Contraseña para confirmar eliminación
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteAccount(password) {
    try {
      await api.delete('/api/users/account', {
        data: { password }
      });

      return {
        success: true,
        message: 'Cuenta eliminada exitosamente'
      };

    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas del usuario
   * @returns {Promise<Object>} Estadísticas del usuario
   */
  async getUserStats() {
    try {
      const response = await api.get('/api/users/stats');
      return {
        success: true,
        stats: response.data
      };

    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

// Exportar instancia única del servicio
export default new UserService();
