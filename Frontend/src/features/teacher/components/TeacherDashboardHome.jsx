import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, BarChart3, MessageSquare, Clock, Award, BookCheck, Video, Plus, TrendingUp } from 'lucide-react';
import {useAuth} from '@/shared/hooks/useAuth';

// Componente de tarjeta de estadísticas
const StatCard = ({ title, value, icon: Icon, change, trend, color = 'red' }) => {
  const colorMap = {
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.red}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {change && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-sm">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
              )}
              <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
              <span className="text-gray-500 ml-1">vs. last month</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de acceso rápido
const QuickActionCard = ({ title, description, icon: Icon, to, color = 'red' }) => {
  const colorMap = {
    red: 'bg-red-500/10 text-red-600',
    blue: 'bg-blue-500/10 text-blue-600',
    green: 'bg-green-500/10 text-green-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };

  return (
    <Link
      to={to}
      className="block group relative overflow-hidden bg-white rounded-xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-lg hover:border-transparent hover:ring-2 hover:ring-red-500/20"
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 rounded-xl p-3 ${colorMap[color] || colorMap.red} transition-colors duration-300 group-hover:bg-red-500/20`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </Link>
  );
};

const TeacherDashboardHome = () => {
  const { user } = useAuth();
  
  // Datos de ejemplo para las estadísticas
  const stats = [
    { 
      title: 'Estudiantes Activos', 
      value: '156', 
      icon: Users, 
      change: '+12 este mes',
      trend: 'up'
    },
    { 
      title: 'Cursos Activos', 
      value: '8', 
      icon: BookOpen, 
      change: '+2 este mes',
      trend: 'up'
    },
    { 
      title: 'Promedio de Finalización', 
      value: '78%', 
      icon: BarChart3,
      change: '+5% vs mes anterior',
      trend: 'up'
    },
    { 
      title: 'Tareas por Revisar', 
      value: '24', 
      icon: BookCheck, 
      change: '5 urgentes',
      trend: 'down'
    }
  ];

  const quickActions = [
    {
      title: 'Crear Nuevo Curso',
      description: 'Comienza a crear un curso desde cero',
      icon: Plus,
      to: '/teacher/courses/new'
    },
    {
      title: 'Ver Mis Cursos',
      description: 'Gestiona y edita tus cursos existentes',
      icon: BookOpen,
      to: '/teacher/courses'
    },
    {
      title: 'Revisar Estudiantes',
      description: 'Ve el progreso de tus estudiantes',
      icon: Users,
      to: '/teacher/students'
    },
    {
      title: 'Ver Análisis',
      description: 'Revisa las métricas de rendimiento',
      icon: BarChart3,
      to: '/teacher/analytics'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hola, {user?.name || 'Profesor'}</h1>
        <p className="text-gray-500 mt-1">Bienvenido a tu panel de control</p>
      </div>
      
      {/* Sección de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            {...stat} 
            color={['red', 'blue', 'green', 'purple'][index % 4]}
          />
        ))}
      </div>
      
      {/* Sección de Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acciones Rápidas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard 
                  key={index} 
                  {...action} 
                  color={['red', 'blue', 'green', 'purple'][index % 4]}
                />
              ))}
            </div>
          </div>
          
          {/* Próximas Clases */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
              <button className="text-sm font-medium text-red-600 hover:text-red-700">Ver todo</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-lg mr-4">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">3 nuevos estudiantes</p>
                  <p className="text-sm text-gray-500">Se inscribieron en tu curso de React</p>
                  <p className="text-xs text-gray-400 mt-1">Hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nuevo mensaje</p>
                  <p className="text-sm text-gray-500">Tienes 5 mensajes sin leer</p>
                  <p className="text-xs text-gray-400 mt-1">Hace 4 horas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Barra Lateral */}
        <div className="space-y-6">
          {/* Progreso de Cursos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Tus Cursos</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Curso de React</span>
                    <span className="text-gray-500">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Curso de Node.js</span>
                    <span className="text-gray-500">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link 
                  to="/teacher/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Ver todos los cursos
                </Link>
              </div>
            </div>
          </div>
          
          {/* Enlaces Rápidos */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Enlaces Rápidos</h2>
            </div>
            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <Link to="/teacher/messages" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-red-600">
                    <MessageSquare className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Mensajes</span>
                    <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">3</span>
                  </Link>
                </li>
                <li>
                  <Link to="/teacher/settings" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-red-600">
                    <svg className="h-5 w-5 mr-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Configuración</span>
                  </Link>
                </li>
                <li>
                  <Link to="/teacher/video-guide" className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-red-600">
                    <Video className="h-5 w-5 mr-3 text-gray-400" />
                    <span>Guía de Producción</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardHome;
