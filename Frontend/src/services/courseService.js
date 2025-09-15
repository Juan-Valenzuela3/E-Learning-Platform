import api from './api';

const createCourse = async (courseData) => {
  try {
    console.log('=== COURSE SERVICE: Enviando datos al backend ===');
    console.log('URL:', '/api/courses');
    console.log('Datos:', courseData);
    console.log('Headers:', { 'Content-Type': 'application/json' });

    const response = await api.post('/api/courses', courseData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('=== COURSE SERVICE: Respuesta exitosa ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);

    return response.data;
  } catch (error) {
    console.error('=== COURSE SERVICE: Error al crear curso ===');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Error Data:', error.response?.data);
    
    // EXPANDIR ERRORES ESPECÍFICOS
    if (error.response?.data?.errors) {
      console.error('=== ERRORES DE VALIDACIÓN ESPECÍFICOS ===');
      error.response.data.errors.forEach((err, index) => {
        console.error(`Error ${index + 1}:`, err);
      });
    }
    
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);

    // Extraer mensaje de error más específico
    let errorMessage = 'No se pudo crear el curso. Por favor, inténtalo de nuevo.';
    
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.errors) {
        // Si hay errores de validación, mostrarlos
        const validationErrors = error.response.data.errors;
        if (Array.isArray(validationErrors)) {
          errorMessage = validationErrors.map(err => err.message || err).join('; ');
        } else {
          errorMessage = JSON.stringify(validationErrors);
        }
      }
    }

    throw new Error(errorMessage);
  }
};

const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/api/courses/${id}`, courseData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'No se pudo actualizar el curso. Por favor, inténtalo de nuevo.');
  }
};

const courseService = {

  

  /**
   * Obtiene la lista de cursos con opciones de filtrado
   * @param {Object} filters - Filtros opcionales (search, category, level, etc.)
   * @returns {Promise<Array>} Lista de cursos
   */
  async getCourses(filters = {}) {
    try {
      const response = await api.get('/api/courses', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error al obtener la lista de cursos:', error.message);
      throw error;
    }
  },

  /**
   * Obtiene los detalles de un curso específico
   * @param {string|number} courseId - ID del curso
   * @returns {Promise<Object>} Detalles del curso
   */
  async getCourseById(courseId) {
    try {
      const response = await api.get(`/api/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener los detalles del curso (ID: ${courseId}):`, error);
      throw new Error(error.response?.data?.message || 'No se pudo cargar el curso. Por favor, inténtalo de nuevo.');
    }
  },
  
  createCourse,
  updateCourse,

  /**
   * Obtiene las categorías de cursos disponibles
   * @returns {Promise<Array>} Lista de categorías
   */
  async getCategories() {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      console.error('Error al cargar las categorías de cursos:', error.message);
      // Retornar categorías por defecto en caso de error
      return [
        { id: 'todos', name: 'Todos los cursos' },
        { id: 'frontend', name: 'Frontend Development' },
        { id: 'backend', name: 'Backend Development' },
        { id: 'fullstack', name: 'Full Stack Development' },
        { id: 'mobile', name: 'Mobile Development' },
        { id: 'data', name: 'Data Science & AI' },
        { id: 'design', name: 'UI/UX Design' },
        { id: 'devops', name: 'DevOps & Cloud' },
      ];
    }
  },

  /**
   * Obtiene los niveles de dificultad disponibles
   * @returns {Promise<Array>} Lista de niveles
   */
  async getLevels() {
    try {
      const response = await api.get('/api/levels');
      return response.data;
    } catch (error) {
      console.error('Error al cargar los niveles de dificultad:', error.message);
      // Retornar niveles por defecto en caso de error
      return [
        { id: 'todos', name: 'Todos los niveles' },
        { id: 'principiante', name: 'Principiante' },
        { id: 'intermedio', name: 'Intermedio' },
        { id: 'avanzado', name: 'Avanzado' },
      ];
    }
  },
};

export default {
  courseService,
  createCourse
};
