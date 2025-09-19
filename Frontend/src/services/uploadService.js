// src/services/uploadService.js
import api from "./api";

/**
 * Sube una imagen de perfil de usuario
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<string>} URL de la imagen subida
 */
export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/users/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.profileImageUrl;
  } catch (error) {
    console.error("Error al subir imagen de perfil:", error);
    throw new Error(
      error.response?.data?.message || "Error al subir la imagen de perfil"
    );
  }
};

/**
 * Sube una imagen de portada de curso
 * @param {File} file - Archivo de imagen a subir
 * @returns {Promise<string>} URL de la imagen subida
 */
export const uploadCourseThumbnail = async (file) => {
  try {
    // Por ahora usamos el mismo endpoint, pero podrías crear uno específico para cursos
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/users/profile/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.profileImageUrl;
  } catch (error) {
    console.error("Error al subir imagen de portada:", error);
    throw new Error(
      error.response?.data?.message || "Error al subir la imagen de portada"
    );
  }
};

/**
 * Valida si un archivo es una imagen válida
 * @param {File} file - Archivo a validar
 * @returns {Object} {isValid: boolean, error?: string}
 */
export const validateImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Tipo de archivo no permitido. Solo se permiten archivos JPG, JPEG y PNG.'
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'El archivo excede el tamaño máximo permitido (5 MB).'
    };
  }

  return { isValid: true };
};