import { useState, useEffect, useMemo } from 'react';
import { getEnrolledCourses } from '@/services/enrollmentService'; // ✅ Importación corregida
import { getCourses } from '@/services/courseService'; // ✅ Servicio para cursos sugeridos
import { useAuth } from '@/contexts/ContextUse'; // ✅ Importamos el hook de autenticación

export function useDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

 useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        let fetchedCourses = [];
        const enrolledData = await getEnrolledCourses();

        if (enrolledData && enrolledData.length > 0) {
          fetchedCourses = enrolledData;
        } else {
          const suggestedData = await getCourses();
          // ✅ Añadimos el progreso = 0 a los cursos sugeridos
          fetchedCourses = suggestedData.slice(0, 4).map(course => ({
            ...course,
            progress: 0
          }));
        }

        setCourses(fetchedCourses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde.");
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const stats = useMemo(() => {
    const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
    const completed = courses.filter(c => c.progress === 100).length;
    const totalEnrolled = courses.length;

    // Estos datos deben ser calculados en el backend para ser precisos
    const completedLessons = courses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);

    return [
      { title: 'Cursos en progreso', value: inProgress, icon: 'BookType' },
      { title: 'Lecciones completadas', value: completedLessons, icon: 'CheckCircle' },
      { title: 'Cursos completados', value: completed, icon: 'Award' },
      { title: 'Cursos Totales', value: totalEnrolled, icon: 'BookType' },
    ];
  }, [courses]);


  const filteredCourses = useMemo(() => {

    return courses;
  }, [courses]);

  // Los datos de actividad y eventos futuros no existen en la API.md, por lo que permanecen como datos de prueba
  const recentActivities = [
    { id: 1, type: 'completion', title: 'Introducción a JavaScript', courseName: 'Desarrollo Web' },
    { id: 2, type: 'new_content', title: 'Módulo 5', courseName: 'React Avanzado' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Webinar de React', startTime: new Date(), endTime: new Date() },
    { id: 2, title: 'Sesión de preguntas y respuestas', startTime: new Date(), endTime: new Date() },
  ];

  return {
    suggestedCourses : courses,
    stats,
    filteredCourses: filteredCourses,
    recentActivities,
    upcomingEvents,
    isLoading,
    error,
  };


};
