// src/shared/hooks/useEnrollInCourse.js
import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { enrollInCourse } from '@/services/enrollmentService';
import { useNavigate } from 'react-router-dom';

export const useEnrollInCourse = () => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const navigate = useNavigate();

  const handleEnrollment = useCallback(async (courseId) => {
    setIsEnrolling(true);
    try {
      const Enrollment = await enrollInCourse(courseId);
      toast.success("¡Te has inscrito al curso con éxito!");

      // Redirigir al usuario al contenido del curso o a su dashboard
      navigate(`/mis-cursos`);

    } catch (error) {
      const errorMessage = error.message || 'Error al inscribirse en el curso.';
      toast.error(errorMessage);
    } finally {
      setIsEnrolling(false);
    }
  }, [navigate]);

  return { handleEnrollment, isEnrolling };
};