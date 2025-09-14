import { useState, useEffect, useMemo } from 'react';
import { format, addDays, isToday, isTomorrow, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export function useDashboard(searchQuery = "", activeTab = "all") {
    const [isLoading, setIsLoading] = useState(true);
    const [courses, setCourses] = useState([]);

    // Mock data - en una app real, esto vendria de una API
    useEffect(() => {
        // Simular llamada a API
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Simular retraso de red
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockCourses = [
                    {
                        id: 1,
                        name: "JavaScript Avanzado",
                        category: "Programación",
                        progress: 85,
                        totalLessons: 15,
                        completedLessons: 12,
                        lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // hace 2 dias
                        image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300",
                        isFavorite: true,
                        status: "en-progreso"
                    },
                    {
                        id: 2,
                        name: "Diseño UX/UI Moderno",
                        category: "Diseño",
                        progress: 45,
                        totalLessons: 20,
                        completedLessons: 9,
                        lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // hace 1 dia
                        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=300",
                        isFavorite: false,
                        status: "en-progreso"
                    },
                    {
                        id: 3,
                        name: "Introducción a Python",
                        category: "Programación",
                        progress: 20,
                        totalLessons: 25,
                        completedLessons: 5,
                        lastAccessed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // hace 5 dias
                        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300",
                        isFavorite: true,
                        status: "guardados"
                    },
                    {
                        id: 4,
                        name: "Marketing Digital",
                        category: "Negocios",
                        progress: 100,
                        totalLessons: 30,
                        completedLessons: 30,
                        lastAccessed: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // hace 10 dias
                        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300",
                        isFavorite: false,
                        status: "completados"
                    }
                ];

                setCourses(mockCourses);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrar y buscar cursos
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category.toLowerCase().includes(searchQuery.toLowerCase());

            if (activeTab === "favorites") {
                return matchesSearch && course.isFavorite;
            } else if (activeTab === "in-progress") {
                return matchesSearch && course.status === "en-progreso";
            } else if (activeTab === "completed") {
                return matchesSearch && course.status === "completados";
            } else if (activeTab === "saved") {
                return matchesSearch && course.status === "guardados";
            }

            return matchesSearch;
        });
    }, [courses, searchQuery, activeTab]);

    // Mock estadísticas
    const stats = [
        { title: 'Cursos en progreso', value: '3', trend: '12%', trendPositive: true, icon: 'BookType' },
        { title: 'Lecciones completadas', value: '24', trend: '5%', trendPositive: true, icon: 'CheckCircle' },
        { title: 'Tiempo de estudio', value: '18h', trend: '2%', trendPositive: true, icon: 'Clock3' },
        { title: 'Logros', value: '5', trend: '0%', trendPositive: false, icon: 'Award' },
    ];

    // Mock actividades recientes
    const recentActivities = [
        {
            id: 1,
            type: 'completion',
            title: 'Completaste la lección de React Hooks',
            time: new Date(Date.now() - 3600000), // hace 1 hora
            courseName: 'JavaScript Avanzado',
            read: false
        },
        // aqui se agregan mas actividades o las que venga de la base de datos
    ];

    // Mock eventos futuros
    const upcomingEvents = [
        {
            id: 1,
            title: 'Sesión en vivo: Introducción a Node.js',
            startTime: new Date(Date.now() + 86400000), // mañana
            endTime: new Date(Date.now() + 86400000 + 2 * 60 * 60 * 1000), // 2 hours later
            platform: 'Zoom',
        },
        // aqui se agregan mas eventos o las que venga de la base de datos
    ];

    // Manejadores
    const handleToggleFavorite = (courseId) => {
        setCourses(courses.map(course =>
            course.id === courseId
                ? { ...course, isFavorite: !course.isFavorite }
                : course
        ));
    };

    const handleMarkAsRead = (activityId) => {
        // aqui se agregan mas actividades o las que venga de la base de datos
        console.log(`Marking activity ${activityId} as read`);
    };

    const handleJoinEvent = (eventId) => {
        // aqui se agregan mas eventos o las que venga de la base de datos
        console.log(`Joining event ${eventId}`);
    };

    // Formatear fecha para mostrar
    const formatDate = (date) => {
        return format(new Date(date), 'd MMM yyyy', { locale: es });
    };

    // Formatear hora para mostrar
    const formatTime = (date) => {
        return format(new Date(date), 'HH:mm');
    };

    return {
        // Data
        stats,
        filteredCourses: filteredCourses || [], // Asegurarse de que filteredCourses sea siempre un array
        recentActivities,
        upcomingEvents,
        loading: isLoading,

        // Handlers
        handleToggleFavorite,
        handleMarkAsRead,
        handleJoinEvent,
        formatDate,
        formatTime
    };
}
