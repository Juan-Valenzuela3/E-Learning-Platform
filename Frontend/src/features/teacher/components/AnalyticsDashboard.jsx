import React, { useState, useEffect, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Users as UsersIcon, 
  BookOpen as BookOpenIcon, 
  Clock as ClockIcon, 
  Award as AwardIcon,
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Eye
} from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

/**
 * Componente que muestra una métrica clave con un ícono, valor y tendencia.
 */
const MetricCard = React.memo(({ title, value, change, trend, icon: Icon, color = 'red' }) => {
  // Aseguramos que Tailwind pueda detectar las clases estáticamente
  const colorBg = `bg-${color}-100`;
  const colorText = `text-${color}-600`;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-grow min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
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
        <div className={`p-3 ${colorBg} rounded-lg flex-shrink-0`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${colorText}`} />
        </div>
      </div>
    </div>
  );
});

/**
 * Componente que muestra el resumen analítico de un curso.
 */
const CourseAnalyticsCard = React.memo(({ course }) => (
  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
      <img 
        src={course.image} 
        alt={course.title}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
        <p className="text-xs sm:text-sm text-gray-500 truncate">{course.category}</p>
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 gap-4">
      <div>
        <p className="text-xs sm:text-sm text-gray-600">Estudiantes</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">{course.students}</p>
      </div>
      <div>
        <p className="text-xs sm:text-sm text-gray-600">Completado</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">{course.completion}%</p>
      </div>
      <div className="lg:col-span-2 md:col-span-1">
        <p className="text-xs sm:text-sm text-gray-600">Valoración</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">{course.rating}</p>
      </div>
      <div className="lg:col-span-2 md:col-span-1">
        <p className="text-xs sm:text-sm text-gray-600">Ingresos</p>
        <p className="text-base sm:text-lg font-semibold text-gray-900">${course.revenue}</p>
      </div>
    </div>
  </div>
));

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const topCourses = useMemo(() => [
    { title: 'Desarrollo Web Moderno', category: 'Programación', students: 124, completion: 78, rating: 4.7, revenue: '2,450', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { title: 'Python para Principiantes', category: 'Programación', students: 89, completion: 85, rating: 4.9, revenue: '1,890', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' },
    { title: 'Fundamentos de Marketing Digital', category: 'Marketing', students: 210, completion: 65, rating: 4.5, revenue: '3,200', image: 'https://images.unsplash.com/photo-1557804506-6a589e-472280?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' }
  ], []);

  const chartData = useMemo(() => ({
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Estudiantes', data: [65, 59, 80, 81, 56, 100], backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 1)', borderWidth: 1,
    }],
  }), []);

  const pieChartData = useMemo(() => ({
    labels: ['Completados', 'En progreso', 'No iniciados'],
    datasets: [{
      data: [65, 25, 10], backgroundColor: ['rgba(34, 197, 94, 0.2)', 'rgba(249, 115, 22, 0.2)', 'rgba(239, 68, 68, 0.2)'], borderColor: ['rgba(34, 197, 94, 1)', 'rgba(249, 115, 22, 1)', 'rgba(239, 68, 68, 1)'], borderWidth: 1,
    }],
  }), []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Estudiantes por mes' },
    },
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = {
          week: { totalStudents: 124, totalCourses: 8, avgCompletion: 72, avgTimeSpent: '3h 45m', studentGrowth: 12, completionRate: 85 },
          month: { totalStudents: 356, totalCourses: 8, avgCompletion: 68, avgTimeSpent: '4h 15m', studentGrowth: 24, completionRate: 78 },
          year: { totalStudents: 1245, totalCourses: 12, avgCompletion: 75, avgTimeSpent: '5h 30m', studentGrowth: 42, completionRate: 82 },
        };
        setStats(mockData[timeRange] || mockData.week);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Análisis de Desempeño</h1>
        <div className="flex flex-wrap gap-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors
                ${timeRange === range ? 'bg-red-500 text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              {range === 'week' ? 'Esta semana' : range === 'month' ? 'Este mes' : 'Este año'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid - CORRECCIÓN CLAVE AQUÍ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <MetricCard
          title="Total Estudiantes"
          value={stats.totalStudents}
          change={`+${stats.studentGrowth}%`} trend="up" icon={UsersIcon} color="red"
        />
        <MetricCard
          title="Cursos Activos"
          value={stats.totalCourses} icon={BookOpenIcon} color="blue"
        />
        <MetricCard
          title="Tiempo Promedio"
          value={stats.avgTimeSpent} change="+12%" trend="up" icon={ClockIcon} color="green"
        />
        <MetricCard
          title="Tasa de Finalización"
          value={`${stats.completionRate}%`} change="+5%" trend="up" icon={AwardIcon} color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-80">
          <h2 className="text-lg font-semibold mb-2">Actividad de Estudiantes</h2>
          <div className="h-[calc(100%-2rem)]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 h-80">
          <h2 className="text-lg font-semibold mb-2">Distribución de Cursos</h2>
          <div className="h-[calc(100%-2rem)] flex items-center justify-center">
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false, }} />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          <h2 className="text-xl font-semibold text-gray-900">Cursos Destacados</h2>
          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
            Ver todos los cursos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topCourses.map((course, index) => (
            <CourseAnalyticsCard key={index} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;