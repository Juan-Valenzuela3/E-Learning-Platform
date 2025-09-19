import api from './api';

/**
 * Obtener videos de un curso
 * @param {number} courseId - ID del curso
 * @returns {Promise<Array>} Lista de videos del curso
 */
export const getCourseVideos = async (courseId) => {
  try {
    const response = await api.get(`/api/course-videos/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener videos del curso:", error);

    if (error.response?.status === 404) {
      throw new Error("Curso no encontrado");
    }
    if (error.response?.status === 403) {
      throw new Error("No tienes acceso a este curso");
    }
    if (error.response?.status === 401) {
      throw new Error("Debes iniciar sesión para ver los videos");
    }

    throw new Error(
      error.response?.data?.message ||
      "Error al cargar los videos del curso. Inténtalo más tarde"
    );
  }
};

/**
 * Obtener detalles de un video específico
 * @param {number} videoId - ID del video
 * @returns {Promise<Object>} Detalles del video
 */
export const getVideoDetails = async (videoId) => {
  try {
    const response = await api.get(`/api/course-videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener detalles del video:", error);

    if (error.response?.status === 404) {
      throw new Error("Video no encontrado");
    }
    if (error.response?.status === 403) {
      throw new Error("No tienes acceso a este video");
    }
    if (error.response?.status === 401) {
      throw new Error("Debes iniciar sesión para ver el video");
    }

    throw new Error(
      error.response?.data?.message ||
      "Error al cargar el video. Inténtalo más tarde"
    );
  }
};

/**
 * Verificar si el usuario puede gestionar videos de un curso
 * @param {number} courseId - ID del curso
 * @returns {Promise<Object>} Permisos de gestión
 */
export const checkVideoManagementPermissions = async (courseId) => {
  try {
    const response = await api.get(`/api/course-videos/course/${courseId}/can-manage`);
    return response.data;
  } catch (error) {
    console.error("Error al verificar permisos de gestión:", error);
    return { canManage: false };
  }
};
