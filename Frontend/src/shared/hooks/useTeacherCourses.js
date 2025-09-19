// src/hooks/useTeacherCourses.js

import { useState, useEffect } from 'react';
import { getCoursesByInstructorId } from '@/services/courseService';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para obtener los cursos de un instructor.
 * @param {number} instructorId - El ID del instructor.
 * @returns {{ courses: Array, loading: boolean, error: string | null }}
 */
export const useTeacherCourses = (instructorId) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    if (!instructorId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const fetchedCourses = await getCoursesByInstructorId(instructorId);
      setCourses(fetchedCourses);
    } catch (err) {
      console.error("Error al cargar los cursos:", err);
      setError("Ocurrió un error al cargar tus cursos.");
      toast.error("Error al cargar tus cursos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorId]);

  const refreshCourses = () => {
    fetchCourses();
  };

  return { courses, loading, error, refreshCourses };
};