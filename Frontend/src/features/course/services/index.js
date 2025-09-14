// Course-related API services will be exported here

// Mock service for enrolled and recommended courses. Replace with real API calls later.

// Simulate network delay
const delay = (ms = 600) => new Promise((res) => setTimeout(res, ms));

// In-memory mock data
const MOCK_ENROLLED = [
    {
        id: 1,
        title: 'Desarrollo Web Moderno',
        instructor: 'Ana García',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3',
        progress: 75,
        lastAccessed: 'Hace 2 días',
        rating: 4.8,
        totalLessons: 24,
        completedLessons: 18,
        category: 'Programación',
        status: 'en-progreso',
    },
    {
        id: 2,
        title: 'Introducción a la Inteligencia Artificial',
        instructor: 'Carlos Ruiz',
        thumbnail: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?ixlib=rb-4.0.3',
        progress: 30,
        lastAccessed: 'Ayer',
        rating: 4.6,
        totalLessons: 32,
        completedLessons: 10,
        category: 'IA',
        status: 'en-progreso',
    },
    {
        id: 3,
        title: 'Diseño UX/UI Avanzado',
        instructor: 'María López',
        thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3',
        progress: 100,
        lastAccessed: 'Hoy',
        rating: 4.9,
        totalLessons: 18,
        completedLessons: 18,
        category: 'Diseño',
        status: 'completados',
    },
];

const MOCK_RECOMMENDED = [
    {
        id: 101,
        title: 'JavaScript Avanzado',
        instructor: 'Pedro Martínez',
        thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=640',
        rating: 4.7,
        totalLessons: 25,
        category: 'Programación',
        price: 29.99,
    },
    {
        id: 102,
        title: 'Machine Learning Práctico',
        instructor: 'Laura Sánchez',
        thumbnail: 'https://images.unsplash.com/photo-1504639725596-001c775445cc?w=640',
        rating: 4.8,
        totalLessons: 30,
        category: 'IA',
        price: 34.99,
    },
    {
        id: 103,
        title: 'Fundamentos de Cloud',
        instructor: 'Diego Ramos',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640',
        rating: 4.6,
        totalLessons: 22,
        category: 'DevOps',
        price: 24.99,
    },
];

export async function getEnrolledCourses() {
    await delay();
    return [...MOCK_ENROLLED];
}

export async function getRecommendedCourses() {
    await delay(500);
    return [...MOCK_RECOMMENDED];
}

export default {
    getEnrolledCourses,
    getRecommendedCourses,
};
