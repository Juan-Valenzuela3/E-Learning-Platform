import api from './api';
import { processApiResponse, ensureArray, handleApiError } from './apiUtils';

/**
 * Servicio para operaciones administrativas
 */
export const adminService = {
  /**
   * Obtiene estadísticas generales del sistema
   * @returns {Promise<Object>} Estadísticas del sistema
   */
  async getStats() {
    try {
      const response = await api.get('/api/admin/stats');
      return processApiResponse(response.data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw handleApiError(error, 'Error al obtener estadísticas');
    }
  },

  /**
   * Obtiene todos los usuarios del sistema
   * @returns {Promise<Array>} Lista de usuarios
   */
  async getAllUsers() {
    try {
      const response = await api.get('/api/users/all');
      return ensureArray(processApiResponse(response.data));
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw handleApiError(error, 'Error al obtener usuarios');
    }
  },

  /**
   * Obtiene cursos activos para administración
   * @returns {Promise<Array>} Lista de cursos activos
   */
  async getActiveCourses() {
    try {
      const response = await api.get('/api/courses/admin/active');
      return ensureArray(processApiResponse(response.data));
    } catch (error) {
      console.error('Error al obtener cursos activos:', error);
      throw handleApiError(error, 'Error al obtener cursos activos');
    }
  },

  /**
   * Obtiene inscripciones recientes
   * @returns {Promise<Array>} Lista de inscripciones recientes
   */
  async getRecentEnrollments() {
    try {
      const response = await api.get('/api/enrollments/recent');
      return ensureArray(processApiResponse(response.data));
    } catch (error) {
      console.error('Error al obtener inscripciones recientes:', error);
      throw handleApiError(error, 'Error al obtener inscripciones recientes');
    }
  },

  /**
   * Obtiene estadísticas de inscripciones
   * @returns {Promise<Array>} Estadísticas de inscripciones por curso
   */
  async getEnrollmentStats() {
    try {
      const response = await api.get('/api/enrollments/stats');
      return ensureArray(processApiResponse(response.data));
    } catch (error) {
      console.error('Error al obtener estadísticas de inscripciones:', error);
      throw handleApiError(error, 'Error al obtener estadísticas de inscripciones');
    }
  }
};
