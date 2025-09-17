// src/services/activityService.js

// Este es un servicio de prueba para simular la obtención de datos de actividad.
// En una aplicación real, harías una llamada a la API con algo como 'axios'.
const mockActivities = [
    {
      id: 'act1',
      type: 'completion',
      title: 'Desarrollo Web Moderno',
      time: new Date(Date.now() - 3600000 * 2),
      courseName: 'Curso Frontend',
    },
    {
      id: 'act2',
      type: 'new_content',
      title: 'Introducción a React Hooks',
      time: new Date(Date.now() - 3600000 * 5),
      courseName: 'Curso de React Avanzado',
    },
    {
      id: 'act3',
      type: 'reminder',
      title: 'Prueba de Módulo 3',
      time: new Date(Date.now() - 3600000 * 10),
      courseName: 'Curso de UI/UX',
    },
  ];
  
  export const getActivities = async (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockActivities);
      }, 500); // Simula un retraso de red
    });
  };