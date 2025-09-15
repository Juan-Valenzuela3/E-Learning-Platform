import React, { useState, Suspense } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw, 
  Users, 
  BookOpen, 
  DollarSign, 
  BarChart2,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in ReportsPage:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-600 bg-red-100 rounded">
          Error al cargar los gráficos. Por favor, recarga la página.
        </div>
      );
    }

    return this.props.children;
  }
}

// Mock data for charts
const monthlyRevenue = [
  { name: 'Ene', Ingresos: 4000, Gastos: 2400 },
  { name: 'Feb', Ingresos: 3000, Gastos: 1398 },
  { name: 'Mar', Ingresos: 2000, Gastos: 9800 },
  { name: 'Abr', Ingresos: 2780, Gastos: 3908 },
  { name: 'May', Ingresos: 1890, Gastos: 4800 },
  { name: 'Jun', Ingresos: 2390, Gastos: 3800 },
  { name: 'Jul', Ingresos: 3490, Gastos: 4300 },
];

const courseEnrollment = [
  { name: 'Desarrollo Web', value: 400 },
  { name: 'Diseño', value: 300 },
  { name: 'Marketing', value: 200 },
  { name: 'Negocios', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const stats = [
  { name: 'Ingresos Totales', value: '$24,780', change: '+8.2%', changeType: 'increase', icon: DollarSign },
  { name: 'Usuarios Nuevos', value: '1,234', change: '+12%', changeType: 'increase', icon: Users },
  { name: 'Cursos Activos', value: '156', change: '+5%', changeType: 'increase', icon: BookOpen },
  { name: 'Tasa de Finalización', value: '78%', change: '+3.5%', changeType: 'increase', icon: TrendingUp },
];

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [isLoading, setIsLoading] = useState(false);

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    // Here you would typically refetch data based on the new date range
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    // Handle export functionality
    alert('Exporting report...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h2>
          <p className="mt-1 text-sm text-gray-500">
            Estadísticas y métricas de rendimiento de la plataforma
          </p>
        </div>
        <div className="flex space-x-3">
          <div className="relative">
            <select
              className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              value={dateRange}
              onChange={handleDateRangeChange}
            >
              <option value="today">Hoy</option>
              <option value="yesterday">Ayer</option>
              <option value="last-7-days">Últimos 7 días</option>
              <option value="last-30-days">Últimos 30 días</option>
              <option value="this-month">Este mes</option>
              <option value="last-month">Mes pasado</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Actualizar
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-50">
                <stat.icon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">{stat.name}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p 
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.changeType === 'increase' ? (
                      <TrendingUp className="self-center flex-shrink-0 w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="self-center flex-shrink-0 w-5 h-5 text-red-500" />
                    )}
                    <span className="ml-1">{stat.change}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* Monthly Revenue Chart */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Ingresos Mensuales</h3>
            <div className="flex space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Ingresos
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Gastos
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyRevenue}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Ingresos" fill="#3B82F6" />
                <Bar dataKey="Gastos" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Enrollment Chart */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Inscripciones por Categoría</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={courseEnrollment}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {courseEnrollment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Chart - Line Chart */}
      <div className="p-6 mt-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Crecimiento de Usuarios</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyRevenue}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Ingresos" stroke="#3B82F6" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Wrap the component with Suspense and ErrorBoundary
export default function ReportsPageWithBoundary() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600">Cargando reportes...</p>
        </div>
      </div>}>
        <ReportsPage />
      </Suspense>
    </ErrorBoundary>
  );
}