// src/hooks/useTeacherCourses.js

import { useState, useEffect } from 'react';
import { getCoursesByInstructorId } from '@/services/courseService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-toastify';

/**
 * Hook personalizado para obtener los cursos del instructor actual autenticado.
 * @returns {{ courses: Array, loading: boolean, error: string | null }}
 */
export const useTeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Obtener usuario autenticado

  useEffect(() => {
    // Si no hay usuario autenticado o no es instructor, no hacemos la llamada
    if (!user || !user.id) {
      console.log('=== useTeacherCourses: Sin usuario autenticado ===');
      setLoading(false);
      setError('Usuario no autenticado');
      return;
    }

    // Verificar que el usuario sea instructor
    if (user.role !== 'INSTRUCTOR' && user.role !== 'ADMIN') {
      console.log('=== useTeacherCourses: Usuario no es instructor ===');
      console.log('Rol del usuario:', user.role);
      setLoading(false);
      setError('Acceso no autorizado');
      return;
    }

    const fetchCourses = async () => {
      console.log('=== useTeacherCourses: Iniciando carga de cursos ===');
      console.log('Instructor ID:', user.id);
      console.log('Usuario completo:', user);
      
      setLoading(true);
      setError(null);
      try {
        const fetchedCourses = await getCoursesByInstructorId(user.id);
        console.log('=== useTeacherCourses: Cursos obtenidos ===');
        console.log('Número de cursos:', fetchedCourses?.length);
        console.log('Cursos:', fetchedCourses);
        setCourses(fetchedCourses || []);
      } catch (err) {
        console.error("=== useTeacherCourses: Error al cargar los cursos ===", err);
        setError("Ocurrió un error al cargar tus cursos.");
        toast.error("Error al cargar tus cursos.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]); // El efecto se vuelve a ejecutar si el usuario cambia

  return { courses, loading, error };
};