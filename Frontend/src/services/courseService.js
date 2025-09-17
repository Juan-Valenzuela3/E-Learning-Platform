// src/services/courseService.js
import api from "./api";

export const getCourses = async () => {
  try {
    const response = await api.get("/api/courses");
    return response.data;
  } catch (error) {
    console.error("Error al cargar los cursos:", error);
    throw new Error(
      error.response?.data?.message || "Error al cargar los cursos"
    );
  }
};


export const getCategories = async () => {
  try {
    const response = await api.get("/api/categories");
    return response.data;
  } catch (error) {
    console.error("Error al cargar las categorías:", error);
    throw new Error(
      error.response?.data?.message || "No tienes permiso para esta acción"
    );
  }
};

export const getLevels = async () => {
  try {
    const response = await api.get("/api/levels");
    return response.data;
  } catch (error) {
    console.error("Error al cargar los niveles:", error);
    throw new Error(
      error.response?.data?.message || "No tienes permiso para esta acción"
    );
  }
};

export const updateCourse = async (id, courseData) =>{
  try{
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
  }catch(error){
    console.error("Error al actualizar el curso:", error);
    throw new Error(
      error.response?.data?.message || "Error al actualizar el curso. Por favor, inténtalo de nuevo."
    );
  }
}

export const getCourseById = async (id) =>{
  try{
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  }catch(error){
    console.error("Error al obtener el curso:", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener el curso. Por favor, inténtalo de nuevo."
    );
  }
}

export const createCourse = async (courseData) => {
  try {
    const response = await api.post("/api/courses", courseData);
    return response.data;
  } catch (error) {
    console.error("Error al crear el curso:", error);
    throw new Error(
      error.response?.data?.message || "Error al crear el curso. Por favor, inténtalo de nuevo."
    );
  }
};

export const getCoursesByInstructorId = async (instructorId) =>{
  try{
    console.log('=== getCoursesByInstructorId: Iniciando ===');
    console.log('Instructor ID:', instructorId);
    
    // Obtener token de autenticación
    const token = localStorage.getItem('authToken');
    const headers = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('=== Token JWT agregado al header ===');
    } else {
      console.warn('=== No hay token JWT disponible ===');
    }
    
    // Intentar primero el endpoint específico del instructor CON AUTENTICACIÓN
    try {
      console.log('=== Intentando endpoint específico con autenticación ===');
      const response = await api.get(`/api/courses/instructor/${instructorId}`, { headers });
      console.log('=== Endpoint específico funcionó ===');
      console.log('Cursos obtenidos:', response.data?.length || 0);
      return response.data || [];
    } catch (specificError) {
      console.warn('=== Endpoint específico falló ===');
      console.warn('Status:', specificError.response?.status);
      console.warn('Error:', specificError.response?.data?.message || specificError.message);
      
      // Si el error es 401/403, puede ser problema de autorización
      if (specificError.response?.status === 401 || specificError.response?.status === 403) {
        console.warn('=== Error de autorización - Verificando token ===');
        
        // Intentar renovar la sesión o redirigir al login si es necesario
        if (specificError.response?.status === 401) {
          console.error('=== Token inválido o expirado ===');
          // En una implementación real, aquí podrías renovar el token o redirigir al login
        }
      }
      
      // FALLBACK ESTRATÉGICO: Usar endpoint público con filtrado robusto
      console.log('=== Ejecutando estrategia de fallback ===');
      
      try {
        // Usar endpoint público (no requiere autenticación)
        const allCoursesResponse = await api.get('/api/courses');
        
        console.log('=== Validando respuesta del fallback ===');
        console.log('Response status:', allCoursesResponse.status);
        
        // Validación robusta de la respuesta
        let allCourses = [];
        
        if (allCoursesResponse.data && Array.isArray(allCoursesResponse.data)) {
          allCourses = allCoursesResponse.data;
        } else {
          console.error('=== Respuesta no es un array válido ===');
          console.error('Type:', typeof allCoursesResponse.data);
          console.error('Is Array:', Array.isArray(allCoursesResponse.data));
          return []; // Retornar array vacío si la respuesta no es válida
        }
        
        console.log('Total de cursos públicos disponibles:', allCourses.length);
        
        // Limitar la cantidad de cursos a procesar para evitar sobrecarga
        if (allCourses.length > 1000) {
          console.warn('=== Demasiados cursos, limitando a los primeros 1000 ===');
          allCourses = allCourses.slice(0, 1000);
        }
        
        // Filtrar cursos por instructor ID con validación robusta
        const instructorCourses = allCourses.filter(course => {
          // Validación exhaustiva del objeto curso
          if (!course || typeof course !== 'object') {
            return false;
          }
          
          // Verificar diferentes posibles estructuras del instructor
          let courseInstructorId = null;
          
          if (course.instructor && course.instructor.id) {
            courseInstructorId = course.instructor.id;
          } else if (course.instructorId) {
            courseInstructorId = course.instructorId;
          } else if (course.instructor_id) {
            courseInstructorId = course.instructor_id;
          }
          
          if (!courseInstructorId) {
            return false;
          }
          
          // Comparar IDs como strings para evitar problemas de tipo
          const matches = courseInstructorId.toString() === instructorId.toString();
          
          if (matches) {
            console.log(`✓ Curso encontrado: "${course.title || 'Sin título'}" (ID: ${course.id})`);
          }
          
          return matches;
        });
        
        console.log('=== Resultado del fallback ===');
        console.log('Cursos del instructor encontrados:', instructorCourses.length);
        
        return instructorCourses;
        
      } catch (fallbackError) {
        console.error('=== Error en el fallback ===');
        console.error('Error:', fallbackError.message);
        
        // ÚLTIMO RECURSO: Retornar array vacío
        console.warn('=== Retornando array vacío como último recurso ===');
        return [];
      }
    }
  }catch(error){
    console.error("=== Error final en getCoursesByInstructorId ===", error);
    throw new Error(
      error.response?.data?.message || "Error al obtener los cursos del instructor. Por favor, inténtalo de nuevo."
    );
  }
}


export const getStudentsByCourseId = async (courseId) => {
  try {
    const response = await api.get(`/api/courses/${courseId}/students`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener estudiantes para el curso ${courseId}:`, error);
    throw new Error(
      error.response?.data?.message || "Error al obtener los estudiantes del curso. Por favor, inténtalo de nuevo."
    );
  }
};