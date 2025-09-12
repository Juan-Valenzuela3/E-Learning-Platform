import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon, UsersIcon, BookOpenIcon, ClockIcon, ChartBarIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    avgCompletion: 0,
    avgTimeSpent: '0h 0m',
    studentGrowth: 0,
    completionRate: 0,
  });

  // Simulated data - replace with actual API call
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on time range
        const mockData = {
          week: {
            totalStudents: 124,
            totalCourses: 8,
            avgCompletion: 72,
            avgTimeSpent: '3h 45m',
            studentGrowth: 12,
            completionRate: 85,
          },
          month: {
            totalStudents: 356,
            totalCourses: 8,
            avgCompletion: 68,
            avgTimeSpent: '4h 15m',
            studentGrowth: 24,
            completionRate: 78,
          },
          year: {
            totalStudents: 1245,
            totalCourses: 12,
            avgCompletion: 75,
            avgTimeSpent: '3h 55m',
            studentGrowth: 42,
            completionRate: 82,
          },
        };

        setStats(mockData[timeRange]);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  // Chart data
  const coursePerformanceData = {
    labels: ['Curso 1', 'Curso 2', 'Curso 3', 'Curso 4', 'Curso 5'],
    datasets: [
      {
        label: 'Tasa de finalización (%)',
        data: [85, 72, 90, 65, 80],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(99, 102, 241, 0.8)',
          'rgba(129, 140, 248, 0.8)',
          'rgba(165, 180, 252, 0.8)',
          'rgba(199, 210, 254, 0.8)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(129, 140, 248, 1)',
          'rgba(165, 180, 252, 1)',
          'rgba(199, 210, 254, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const studentEngagementData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Horas de aprendizaje',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const StatCard = ({ title, value, icon: Icon, change, isPositive }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {change && (
              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isPositive ? (
                  <ArrowUpIcon className="-ml-0.5 mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownIcon className="-ml-0.5 mr-1 h-3 w-3 text-red-500" />
                )}
                {change}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Análisis y Estadísticas</h2>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeRange === 'week' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Esta semana
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium ${
              timeRange === 'month' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Este mes
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeRange === 'year' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Este año
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Estudiantes" 
          value={stats.totalStudents} 
          icon={UsersIcon} 
          change={stats.studentGrowth} 
          isPositive={true} 
        />
        <StatCard 
          title="Cursos Publicados" 
          value={stats.totalCourses} 
          icon={BookOpenIcon} 
        />
        <StatCard 
          title="Tasa de Finalización" 
          value={`${stats.avgCompletion}%`} 
          icon={ChartBarIcon} 
          change={stats.completionRate - 100} 
          isPositive={stats.completionRate >= 100} 
        />
        <StatCard 
          title="Tiempo Promedio" 
          value={stats.avgTimeSpent} 
          icon={ClockIcon} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rendimiento por Curso</h3>
          <div className="h-80">
            <Pie 
              data={coursePerformanceData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }} 
            />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Compromiso de los Estudiantes</h3>
          <div className="h-80">
            <Bar 
              data={studentEngagementData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'Horas'
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Meses'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
