import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  getAllEnrollments
} from '@/services/enrollmentService';
import { getCourses } from '@/services/courseService';
import { useAuth } from '@/contexts/ContextUse';
import { processApiResponse, ensureArray, handleApiError } from '@/services/apiUtils';

export function useDashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [error, setError] = useState(null);


  const refreshData = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Obtener TODAS las inscripciones del estudiante
      const [enrollmentsData, suggestedData] = await Promise.allSettled([
        getAllEnrollments(),
        getCourses()
      ]);

      // Procesar inscripciones
      if (enrollmentsData.status === 'fulfilled') {
        console.log('📊 Datos brutos de enrollments:', enrollmentsData.value);
        console.log('�� Tipo de datos brutos:', typeof enrollmentsData.value);
        console.log(' Es array bruto:', Array.isArray(enrollmentsData.value));

        const processedEnrollments = ensureArray(processApiResponse(enrollmentsData.value));
        console.log(' Datos procesados - Inscripciones:', processedEnrollments);
        console.log(' Cantidad de inscripciones procesadas:', processedEnrollments.length);
        console.log('🔄 Tipo de datos procesados:', typeof processedEnrollments);
        console.log(' Es array procesado:', Array.isArray(processedEnrollments));

        // Verificar cada inscripción
        processedEnrollments.forEach((enrollment, index) => {
          console.log(` Inscripción ${index}:`, enrollment);
          console.log(`🔄 Curso ${index}:`, enrollment.course);
          if (enrollment.course) {
            console.log(`🔄 Título del curso ${index}:`, enrollment.course.title);
          }
        });

        setEnrollments(processedEnrollments);
      } else {
        console.warn('Error fetching enrollments:', enrollmentsData.reason);
        setEnrollments([]);
      }

      // Procesar cursos sugeridos
      if (suggestedData.status === 'fulfilled') {
        const processedSuggested = ensureArray(processApiResponse(suggestedData.value));
        setSuggestedCourses(processedSuggested.slice(0, 6));
      } else {
        console.warn('Error fetching suggested courses:', suggestedData.reason);
        setSuggestedCourses([]);
      }

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(handleApiError(err, "Error al cargar los datos del dashboard"));
      setSuggestedCourses([]);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const stats = useMemo(() => {
    // Debug: Ver datos de inscripciones
    console.log('useDashboard - stats calculation - enrollments:', enrollments);

    // Calcular estadísticas basadas en inscripciones reales
    const activeEnrollments = enrollments.filter(e => e.status === 'ACTIVE');
    const completedEnrollments = enrollments.filter(e => e.status === 'COMPLETED');

    console.log('useDashboard - activeEnrollments:', activeEnrollments);
    console.log('useDashboard - completedEnrollments:', completedEnrollments);

    const inProgress = activeEnrollments.filter(e =>
      e.progressPercentage > 0 && e.progressPercentage < 100
    ).length;

    const completed = completedEnrollments.length;

    console.log('useDashboard - inProgress:', inProgress);
    console.log('useDashboard - completed:', completed);

    // Calcular horas totales estimadas de estudio
    const totalHours = activeEnrollments.reduce((sum, e) => {
      const course = e.course;
      const estimatedHours = course?.estimatedHours || 0;
      const progressRatio = (e.progressPercentage || 0) / 100;
      return sum + (estimatedHours * progressRatio);
    }, 0);

    // Calcular lecciones completadas (aproximación basada en progreso)
    const completedLessons = activeEnrollments.reduce((sum, e) => {
      const course = e.course;
      const estimatedLessons = course?.estimatedHours ? Math.ceil(course.estimatedHours / 2) : 0; // Aprox 2 horas por lección
      const progressRatio = (e.progressPercentage || 0) / 100;
      return sum + Math.floor(estimatedLessons * progressRatio);
    }, 0);

    return [
      {
        title: 'Cursos en progreso',
        value: inProgress,
        icon: 'BookType',
        change: inProgress > 0 ? `+${inProgress} curso${inProgress > 1 ? 's' : ''} activo${inProgress > 1 ? 's' : ''}` : 'Ninguno en progreso'
      },
      {
        title: 'Lecciones completadas',
        value: completedLessons,
        icon: 'CheckCircle',
        change: completedLessons > 0 ? `+${completedLessons} lección${completedLessons > 1 ? 'es' : ''} esta semana` : 'Comienza tu primer curso'
      },
      {
        title: 'Cursos completados',
        value: completed,
        icon: 'Award',
        change: completed > 0 ? `+${completed} curso${completed > 1 ? 's' : ''} terminado${completed > 1 ? 's' : ''}` : '¡Completa tu primer curso!'
      },
      {
        title: 'Horas estudiadas',
        value: `${Math.round(totalHours)}h`,
        icon: 'Clock3',
        change: totalHours > 0 ? `+${Math.round(totalHours * 0.1)}h esta semana` : '¡Comienza a estudiar!'
      },
    ];
  }, [enrollments]);


  const filteredCourses = useMemo(() => {
    // Debug: Ver qué datos están llegando
    console.log('🔍 useDashboard - enrollments data:', enrollments);
    console.log('🔍 useDashboard - enrollments length:', enrollments.length);
    console.log('🔍 useDashboard - enrollments type:', typeof enrollments);
    console.log('🔍 useDashboard - is array:', Array.isArray(enrollments));

    if (!enrollments || enrollments.length === 0) {
      console.log('⚠️ useDashboard - No hay inscripciones disponibles');
      return [];
    }

    // Mapear inscripciones a formato de cursos para CourseList
    const mappedCourses = enrollments.map((enrollment, index) => {
      console.log(`🔍 useDashboard - enrollment ${index}:`, enrollment);
      console.log(`🔍 useDashboard - course ${index}:`, enrollment.course);
      console.log(`🔍 useDashboard - course keys ${index}:`, Object.keys(enrollment.course || {}));

      const course = enrollment.course;

      if (!course) {
        console.log(`⚠️ useDashboard - No course data for enrollment ${index}`);
        return null;
      }

      // Verificar si el curso tiene datos válidos
      if (!course.id) {
        console.log(`⚠️ useDashboard - Invalid course data for enrollment ${index}:`, course);
        return null;
      }

      const mappedCourse = {
        id: course.id,
        title: course.title || 'Curso sin título',
        description: course.description || '',
        shortDescription: course.shortDescription || '',
        imageUrl: course.thumbnailUrl || course.imageUrl,
        category: course.category?.name || course.subcategory?.name || 'Sin categoría',
        instructor: course.instructor?.userName || course.instructor?.name || 'Instructor',
        price: course.price || 0,
        rating: course.rating || 0,
        progress: enrollment.progressPercentage || 0,
        status: enrollment.status || 'ACTIVE',
        enrollmentDate: enrollment.enrollmentDate || enrollment.enrolledAt,
        lastAccessed: enrollment.lastAccessed,
        lastLessonId: enrollment.lastLessonId,
        estimatedHours: course.estimatedHours || 0,
        isPremium: course.isPremium || false,
        isPublished: course.isPublished || false,
        isActive: course.isActive || false,
        enrollmentId: enrollment.id
      };

      console.log(`✅ useDashboard - mapped course ${index}:`, mappedCourse);
      return mappedCourse;
    }).filter(Boolean);

    console.log('✅ useDashboard - mappedCourses final:', mappedCourses);
    console.log('✅ useDashboard - mappedCourses length:', mappedCourses.length);

    return mappedCourses;
  }, [enrollments]);

  // Generar actividades recientes basadas en inscripciones reales
  const recentActivities = useMemo(() => {
    const activities = [];

    enrollments.forEach(enrollment => {
      const course = enrollment.course;
      if (!course) return;

      // Actividad de inscripción
      activities.push({
        id: `enrollment-${enrollment.id}`,
        type: 'enrollment',
        title: `Te inscribiste en ${course.title}`,
        courseName: course.title,
        timestamp: new Date(enrollment.enrollmentDate),
        icon: 'BookOpen'
      });

      // Actividad de progreso si hay progreso
      if (enrollment.progressPercentage > 0) {
        activities.push({
          id: `progress-${enrollment.id}`,
          type: 'progress',
          title: `${enrollment.progressPercentage}% completado en ${course.title}`,
          courseName: course.title,
          timestamp: new Date(enrollment.updatedAt || enrollment.enrollmentDate),
          icon: 'TrendingUp'
        });
      }

      // Actividad de finalización si está completado
      if (enrollment.status === 'COMPLETED') {
        activities.push({
          id: `completion-${enrollment.id}`,
          type: 'completion',
          title: `¡Felicidades! Completaste ${course.title}`,
          courseName: course.title,
          timestamp: new Date(enrollment.completedAt || enrollment.updatedAt),
          icon: 'Award'
        });
      }
    });

    // Ordenar por timestamp y tomar los más recientes
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
  }, [enrollments]);

  // Eventos futuros (por ahora mockeados, pero se pueden conectar con una API de eventos)
  const upcomingEvents = useMemo(() => {
    return [
      {
        id: 1,
        title: 'Webinar: Mejores Prácticas en React',
        description: 'Aprende las mejores prácticas para desarrollar aplicaciones React escalables',
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 días desde ahora
        endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hora de duración
        type: 'webinar',
        instructor: 'María García'
      },
      {
        id: 2,
        title: 'Sesión de Preguntas y Respuestas',
        description: 'Resuelve tus dudas con nuestros instructores expertos',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 días desde ahora
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 minutos de duración
        type: 'q&a',
        instructor: 'Equipo de Instructores'
      }
    ];
  }, []);

  return {
    suggestedCourses,
    stats,
    filteredCourses,
    recentActivities,
    upcomingEvents,
    enrollments,
    isLoading,
    error,
    showSuggested: enrollments.length === 0, // Mostrar sugeridos si no hay cursos inscritos
    refreshData
  };


};
