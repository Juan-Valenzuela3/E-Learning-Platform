import { useState } from 'react';
import { updateCourseProgress, markCourseAsCompleted } from '@/services/enrollmentService';
import { toast } from 'sonner';

/**
 * Hook para manejar el progreso de cursos
 * @param {Array} enrollments - Lista de inscripciones
 * @returns {Object} Funciones y estado para manejar el progreso
 */
export const useCourseProgress = (enrollments = []) => {
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const [completingCourse, setCompletingCourse] = useState(null);

  /**
   * Actualizar el progreso de un curso
   * @param {number} courseId - ID del curso
   * @param {number} progress - Progreso del curso (0-100)
   */
  const updateProgress = async (courseId, progress) => {
    try {
      setUpdatingProgress(true);

      // Buscar el enrollmentId del curso
      const enrollment = enrollments.find(e => e.course?.id === courseId);
      if (!enrollment || !enrollment.id) {
        throw new Error("No se encontró la información de inscripción");
      }

      await updateCourseProgress(enrollment.id, progress);
      toast.success(`Progreso actualizado al ${progress}%`);

      // Recargar la página para actualizar los datos
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el progreso:", error);
      toast.error(error.message || "Error al actualizar el progreso");
    } finally {
      setUpdatingProgress(false);
    }
  };

  /**
   * Marcar un curso como completado
   * @param {number} courseId - ID del curso
   */
  const completeCourse = async (courseId) => {
    try {
      setCompletingCourse(courseId);

      // Buscar el enrollmentId del curso
      const enrollment = enrollments.find(e => e.course?.id === courseId);
      if (!enrollment || !enrollment.id) {
        throw new Error("No se encontró la información de inscripción");
      }

      await markCourseAsCompleted(enrollment.id);
      toast.success("¡Felicidades! Has completado el curso");

      // Recargar la página para actualizar los datos
      window.location.reload();
    } catch (error) {
      console.error("Error al completar el curso:", error);
      toast.error(error.message || "Error al completar el curso");
    } finally {
      setCompletingCourse(null);
    }
  };

  /**
   * Obtener el progreso de un curso específico
   * @param {number} courseId - ID del curso
   * @returns {number} Progreso del curso (0-100)
   */
  const getCourseProgress = (courseId) => {
    const enrollment = enrollments.find(e => e.course?.id === courseId);
    return enrollment?.progressPercentage || 0;
  };

  /**
   * Verificar si un curso está completado
   * @param {number} courseId - ID del curso
   * @returns {boolean} True si el curso está completado
   */
  const isCourseCompleted = (courseId) => {
    const enrollment = enrollments.find(e => e.course?.id === courseId);
    return enrollment?.status === 'COMPLETED' || enrollment?.progressPercentage === 100;
  };

  return {
    updateProgress,
    completeCourse,
    getCourseProgress,
    isCourseCompleted,
    updatingProgress,
    completingCourse
  };
};
