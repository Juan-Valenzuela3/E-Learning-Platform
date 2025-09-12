import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, BookOpen, BarChart3, MessageSquare, Clock, Award, BookCheck, Video } from 'lucide-react';
import Sidebar from '@/ui/common/Sidebar';


// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
    {change && (
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className="font-medium text-green-700">{change}</span>
        </div>
      </div>
    )}
  </div>
);

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');

  // Datos de ejemplo para las estadísticas
  const stats = [
    { title: 'Total Estudiantes', value: '156', icon: Users, change: '+12 este mes' },
    { title: 'Cursos Activos', value: '8', icon: BookOpen, change: '+2 este mes' },
    { title: 'Promedio de Finalización', value: '78%', icon: BarChart3 },
    { title: 'Tareas por Revisar', value: '24', icon: BookCheck, change: '5 urgente' },
    { title: 'Horas de Clase', value: '42h', icon: Clock, change: 'Esta semana' },
    { title: 'Valoración Promedio', value: '4.8/5', icon: Award }
  ];

  return (
    <>
      
      
    
    
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Panel del Profesor</h1>
          <p className="mt-1 text-sm text-gray-500">
            Bienvenido de nuevo, Profesor. Aquí tienes un resumen de tu actividad.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Navegación */}
        <div className="border-b border-gray-200 mt-8 mb-6">
          <nav className="-mb-px flex space-x-8">
            <Link
              to="/teacher/students"
              onClick={() => setActiveTab('students')}
              className={`${activeTab === 'students' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Mis Cursos
            </Link>
            <Link
              to="/teacher/courses"
              onClick={() => setActiveTab('courses')}
              className={`${activeTab === 'courses' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} 
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Estudiantes
            </Link>
            <Link
              to="/teacher/analytics"
              onClick={() => setActiveTab('analytics')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'analytics' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Análisis
            </Link>
            <Link
              to="/teacher/video-guide"
              onClick={() => setActiveTab('video-guide')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'video-guide' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <span className="flex items-center">
                <Video className="h-5 w-5 mr-1" />
                Guía de Video
              </span>
            </Link>
          </nav>
        </div>

        {/* Contenido de la sección seleccionada */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
    </>
  );
};

export default TeacherDashboard;