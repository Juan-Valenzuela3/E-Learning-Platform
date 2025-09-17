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
    const response = await api.get(`/api/courses/instructor/${instructorId}`);
    return response.data;
  }catch(error){
    console.error("Error al obtener los cursos del instructor:", error);
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