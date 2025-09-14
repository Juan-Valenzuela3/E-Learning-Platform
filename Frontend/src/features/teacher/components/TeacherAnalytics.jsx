import React, { useState } from 'react';
import { BarChart3, Users, BookOpen, TrendingUp, TrendingDown, Eye, Clock, Award } from 'lucide-react';

const MetricCard = ({ title, value, change, trend, icon: Icon, color = 'blue' }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <div className="flex items-center mt-2">
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 ${color === 'blue' ? 'bg-red-100' : `bg-${color}-100`} rounded-lg`}>
        <Icon className={`h-6 w-6 ${color === 'blue' ? 'text-red-600' : `text-${color}-600`}`} />
      </div>
    </div>
  </div>
);

const CourseAnalyticsCard = ({ course }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center space-x-4 mb-4">
      <img 
        src={course.image} 
        alt={course.title}
        className="w-12 h-12 rounded-lg object-cover"
      />
      <div>
        <h3 className="font-semibold text-gray-900">{course.title}</h3>
        <p className="text-sm text-gray-500">{course.category}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-gray-600">Estudiantes</p>
        <p className="text-lg font-semibold text-gray-900">{course.students}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Completado</p>
        <p className="text-lg font-semibold text-gray-900">{course.completion}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Calificación</p>
        <p className="text-lg font-semibold text-gray-900">{course.rating}/5</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Ingresos</p>
        <p className="text-lg font-semibold text-gray-900">${course.revenue}</p>
      </div>
    </div>
  </div>
);

const TeacherAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const metrics = [
    {
      title: 'Total de Estudiantes',
      value: '1,247',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'red'
    },
    {
      title: 'Cursos Completados',
      value: '89',
      change: '+8.2%',
      trend: 'up',
      icon: BookOpen,
      color: 'green'
    },
    {
      title: 'Tiempo Promedio',
      value: '4.2h',
      change: '-5.1%',
      trend: 'down',
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Calificación Promedio',
      value: '4.8',
      change: '+0.3',
      trend: 'up',
      icon: Award,
      color: 'yellow'
    }
  ];

  const topCourses = [
    {
      title: 'Desarrollo Web Moderno',
      category: 'Programación',
      students: 124,
      completion: 78,
      rating: 4.7,
      revenue: '2,450',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      title: 'Python para Principiantes',
      category: 'Programación',
      students: 89,
      completion: 85,
      rating: 4.9,
      revenue: '1,890',
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      title: 'Machine Learning Básico',
      category: 'IA',
      students: 67,
      completion: 72,
      rating: 4.6,
      revenue: '1,340',
      image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ];

  const grafico = [
    {
        title: 'Total de Estudiantes',
        value: '1,247',
        change: '+12.5%',
        trend: 'up',
        icon: Users,
        color: 'red'
      },
      {
        title: 'Cursos Completados',
        value: '89',
        change: '+8.2%',
        trend: 'up',
        icon: BookOpen,
        color: 'green'
      },
      {
        title: 'Tiempo Promedio',
        value: '4.2h',
        change: '-5.1%',
        trend: 'down',
        icon: Clock,
        color: 'purple'
      },
      {
        title: 'Calificación Promedio',
        value: '4.8',
        change: '+0.3',
        trend: 'up',
        icon: Award,
        color: 'yellow'
      }
    
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis y Métricas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Revisa el rendimiento de tus cursos y estudiantes
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-4 sm:mt-0 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
          <option value="1y">Último año</option>
        </select>
      </div>

      {/* Métricas Principales */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas Principales</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Gráfico de Rendimiento */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Rendimiento en el Tiempo</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Gráfico de rendimiento</p>
            <p className="text-sm text-gray-400">Integración con biblioteca de gráficos pendiente</p>
          </div>
        </div>
      </div>

      {/* Top Cursos */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cursos con Mejor Rendimiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCourses.map((course, index) => (
            <CourseAnalyticsCard key={index} course={course} />
          ))}
        </div>
      </div>

      {/* Tabla de Estadísticas Detalladas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Estadísticas Detalladas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudiantes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasa de Finalización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Calificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ingresos
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{course.completion}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-900">{course.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${course.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAnalytics;
