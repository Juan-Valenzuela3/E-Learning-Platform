import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, BarChart3, MessageSquare, BookCheck, Video, Plus, TrendingUp, Settings, ArrowRight, Award } from 'lucide-react';
import { useAuth } from '@/shared/hooks/useAuth';

// Mapeo de colores para evitar la generación dinámica de clases
const colorMaps = {
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    hoverBg: 'hover:bg-red-500/20',
    ring: 'ring-red-500/20',
    trend: 'text-red-600',
    trendBg: 'bg-red-500/10'
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    hoverBg: 'hover:bg-blue-500/20',
    ring: 'ring-blue-500/20',
    trend: 'text-blue-600',
    trendBg: 'bg-blue-500/10'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    hoverBg: 'hover:bg-green-500/20',
    ring: 'ring-green-500/20',
    trend: 'text-green-600',
    trendBg: 'bg-green-500/10'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    hoverBg: 'hover:bg-purple-500/20',
    ring: 'ring-purple-500/20',
    trend: 'text-purple-600',
    trendBg: 'bg-purple-500/10'
  }
};

// Componente de tarjeta de estadísticas
const StatCard = React.memo(({ title, value, icon: Icon, change, trend, color = 'red' }) => {
  const colorScheme = colorMaps[color] || colorMaps.red;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const TrendIcon = trend === 'up' ? TrendingUp : () => <TrendingUp className="transform rotate-180" />;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          </div>
          <div className={`p-3 rounded-xl ${colorScheme.bg} ${colorScheme.text}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {change && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center text-sm">
              <TrendIcon className={`h-4 w-4 mr-1 ${trendColor}`} />
              <span className={`font-medium ${trendColor}`}>{change}</span>
              <span className="text-gray-500 ml-1">vs. mes anterior</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// Componente de acceso rápido
const QuickActionCard = React.memo(({ title, description, icon: Icon, to, color = 'red' }) => {
  const colorScheme = colorMaps[color] || colorMaps.red;

  return (
    <Link
      to={to}
      className={`block group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-transparent hover:ring-2 ${colorScheme.ring}`}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 rounded-xl p-3 ${colorScheme.trendBg} ${colorScheme.trend} transition-colors duration-300 ${colorScheme.hoverBg}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <ArrowRight className="ml-4 h-6 w-6 text-gray-400 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </Link>
  );
});

// Componente principal del Dashboard
const TeacherDashboardHome = () => {
  const { user } = useAuth();
  
  const stats = [
    { title: 'Estudiantes Activos', value: '156', icon: Users, change: '+12', trend: 'up' },
    { title: 'Cursos Activos', value: '8', icon: BookOpen, change: '+2', trend: 'up' },
    { title: 'Promedio de Finalización', value: '78%', icon: Award, change: '+5%', trend: 'up' },
    { title: 'Tareas por Revisar', value: '24', icon: BookCheck, change: '5 urgentes', trend: 'down' }
  ];

  const quickActions = [
    { title: 'Crear Nuevo Curso', description: 'Comienza a crear un curso desde cero', icon: Plus, to: '/teacher/courses/new' },
    { title: 'Ver Mis Cursos', description: 'Gestiona y edita tus cursos existentes', icon: BookOpen, to: '/teacher/courses' },
    { title: 'Revisar Estudiantes', description: 'Ve el progreso de tus estudiantes', icon: Users, to: '/teacher/students' },
    { title: 'Ver Análisis', description: 'Revisa las métricas de rendimiento', icon: BarChart3, to: '/teacher/analytics' }
  ];

  const recentActivity = [
    { type: 'students', text: '3 nuevos estudiantes', subtext: 'Se inscribieron en tu curso de React', time: 'Hace 2 horas', icon: Users, color: 'green' },
    { type: 'message', text: 'Nuevo mensaje', subtext: 'Tienes 5 mensajes sin leer', time: 'Hace 4 horas', icon: MessageSquare, color: 'blue' },
  ];

  const yourCourses = [
    { name: 'Curso de React', progress: 75, color: 'bg-red-500' },
    { name: 'Curso de Node.js', progress: 45, color: 'bg-blue-500' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Hola, {user?.name || 'Profesor'}</h1>
          <p className="text-base text-gray-500 mt-1 md:mt-2">Bienvenido a tu panel de control</p>
        </header>

        {/* Sección de Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              {...stat} 
              color={['red', 'blue', 'green', 'purple'][index % 4]}
            />
          ))}
        </div>
        
        {/* Contenido Principal y Barra Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Acciones Rápidas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Acciones Rápidas</h2>
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
            
            {/* Actividad Reciente */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
                <button className="text-sm font-medium text-red-600 hover:text-red-700">Ver todo</button>
              </div>
              <div className="p-6 space-y-5">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 p-3 rounded-xl ${activity.color === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      <activity.icon className={`h-6 w-6 ${activity.color === 'green' ? 'text-green-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium text-gray-900">{activity.text}</p>
                      <p className="text-sm text-gray-500">{activity.subtext}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Columna de la barra lateral */}
          <div className="space-y-6 md:space-y-8">
            {/* Progreso de Cursos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Tus Cursos</h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {yourCourses.map((course, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{course.name}</span>
                        <span className="text-gray-500">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`${course.color} h-2.5 rounded-full`} style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link 
                    to="/teacher/courses"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Ver todos los cursos
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Enlaces Rápidos */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Enlaces Rápidos</h2>
              </div>
              <div className="p-4">
                <ul className="space-y-2">
                  {[
                    { to: '/teacher/messages', icon: MessageSquare, label: 'Mensajes', badge: 3 },
                    { to: '/teacher/settings', icon: Settings, label: 'Configuración' },
                    { to: '/teacher/video-guide', icon: Video, label: 'Guía de Producción' },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link to={link.to} className="flex items-center p-3 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-red-600 transition-colors">
                        <link.icon className="h-5 w-5 mr-3 text-gray-400" />
                        <span>{link.label}</span>
                        {link.badge && (
                          <span className="ml-auto bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboardHome;