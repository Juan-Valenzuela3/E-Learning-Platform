// src/services/courseService.js
import api from "./api";
import { processApiResponse, ensureArray, ensureObject, handleApiError } from "./apiUtils";
// Obtener subcategorías por categoría (para edición de curso)
export const getSubcategoriesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/api/subcategories/category/${categoryId}`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar subcategorías:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};
// Eliminar curso (versión develop)
export const deleteCourse = async (courseId) => {
  try {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await api.delete(`/api/courses/${courseId}`, { headers });
    return response.data;
  } catch (error) {
    let errorMessage = "Error al eliminar el curso. Por favor, inténtalo de nuevo.";
    if (error.response?.status === 401) {
      errorMessage = "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
    } else if (error.response?.status === 403) {
      errorMessage = "No tienes permisos para eliminar este curso.";
    } else if (error.response?.status === 404) {
      errorMessage = "El curso no fue encontrado.";
    } else if (error.response?.status === 400) {
      errorMessage = "No se puede eliminar un curso con estudiantes inscritos.";
    } else if (error.response?.status === 500) {
      errorMessage = "Error interno del servidor. Verifica tu conexión e inténtalo de nuevo.";
    } else if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    }
    throw new Error(errorMessage);
  }
};

// Obtener los cursos de la API DE MANERA PUBLICA
export const getCourses = async () => {
  try {
    const response = await api.get("/api/courses");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar los cursos:", error);
    throw handleApiError(error, "Error al cargar los cursos");
  }
};

// Obtener las categorías de la API
export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};
// Obtener los niveles de la API
export const getLevels = async () => {
  try {
    const response = await api.get("/api/levels");
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al cargar los niveles:", error);
    throw handleApiError(error, "No tienes permiso para esta acción");
  }
};
// Actualizar un curso de la API
export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    throw handleApiError(error, "Error al actualizar el curso. Por favor, inténtalo de nuevo.");
  }
}
// Obtener un curso de la API por su id
export const getCourseById = async (id) => {
  try {
    const response = await api.get(`/api/courses/${id}`);
    console.log("📊 Respuesta completa del backend:", response.data);

    // Si la respuesta es un string JSON muy largo, extraer solo los datos esenciales
    if (typeof response.data === 'string') {
      try {
        // Intentar parsear el JSON completo primero
        const parsed = JSON.parse(response.data);
        console.log("✅ JSON parseado exitosamente");
        return parsed;
      } catch (error) {
        console.log("⚠️ JSON muy largo, extrayendo datos esenciales...");
        console.error("❌ Error al parsear JSON:", error);

        // Extraer solo los datos esenciales del curso usando regex
        const courseData = {
          id: response.data.match(/"id":(\d+)/)?.[1] ? parseInt(response.data.match(/"id":(\d+)/)[1]) : null,
          title: response.data.match(/"title":"([^"]+)"/)?.[1] || '',
          description: response.data.match(/"description":"([^"]+)"/)?.[1] || '',
          shortDescription: response.data.match(/"shortDescription":"([^"]+)"/)?.[1] || '',
          youtubeUrls: response.data.match(/"youtubeUrls":(\[[^\]]+\])/)?.[1] ? JSON.parse(response.data.match(/"youtubeUrls":(\[[^\]]+\])/)[1]) : [],
          thumbnailUrl: response.data.match(/"thumbnailUrl":"([^"]+)"/)?.[1] || '',
          price: response.data.match(/"price":([\d.]+)/)?.[1] ? parseFloat(response.data.match(/"price":([\d.]+)/)[1]) : 0,
          isPremium: response.data.match(/"isPremium":(true|false)/)?.[1] === 'true',
          isPublished: response.data.match(/"isPublished":(true|false)/)?.[1] === 'true',
          isActive: response.data.match(/"isActive":(true|false)/)?.[1] === 'true',
          estimatedHours: response.data.match(/"estimatedHours":(\d+)/)?.[1] ? parseInt(response.data.match(/"estimatedHours":(\d+)/)[1]) : 0,
          createdAt: response.data.match(/"createdAt":"([^"]+)"/)?.[1] || '',
          updatedAt: response.data.match(/"updatedAt":"([^"]+)"/)?.[1] || ''
        };

        console.log("✅ Datos del curso extraídos:", courseData);
        return courseData;
      }
    }

    // Si la respuesta tiene un campo 'message' con JSON string, parsearlo
    if (response.data && typeof response.data === 'object' && response.data.message) {
      try {
        const parsed = JSON.parse(response.data.message);
        console.log("✅ JSON parseado desde message:", parsed);
        return parsed;
      } catch (error) {
        console.error("❌ Error al parsear message:", error);
        return response.data;
      }
    }

    // Si ya es un objeto, devolverlo
    return response.data;
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    throw handleApiError(error, "Error al obtener el curso. Por favor, inténtalo de nuevo.");
  }
};
// Crear un curso de la API
export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/api/courses", courseData);
    return ensureObject(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al crear el curso:", error);
    throw handleApiError(error, "Error al crear el curso. Por favor, inténtalo de nuevo.");
  }
};

// Obtener los cursos de un instructor de la API
export const getCoursesByInstructorId = async (instructorId) => {
  try {
    const response = await api.get(`/api/courses/instructor/${instructorId}`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error("Error al obtener los cursos del instructor:", error);
    throw handleApiError(error, "Error al obtener los cursos del instructor. Por favor, inténtalo de nuevo.");
  }
}

// Obtener los estudiantes de un curso de la API
export const getStudentsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/students`);
    return ensureArray(processApiResponse(response.data));
  } catch (error) {
    console.error(`Error al obtener estudiantes para el curso ${courseId}:`, error);
    throw handleApiError(error, "Error al obtener los estudiantes del curso. Por favor, inténtalo de nuevo.");
  }
};