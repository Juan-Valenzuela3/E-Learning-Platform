import { Users, BookOpen, DollarSign, CheckCircle, Clock, ArrowRight,
  Award, Star, TrendingUp, TrendingDown, Eye, Calendar, BarChart2
 } from 'lucide-react';

export default function DashboardPage() {
  // Mock data - replace with actual API calls
  const stats = [
    { name: 'Usuarios Totales', value: '2,345', icon: Users, change: '+12%', changeType: 'increase' },
    { name: 'Cursos Activos', value: '156', icon: BookOpen, change: '+5%', changeType: 'increase' },
    { name: 'Ingresos Mensuales', value: '$24,780', icon: DollarSign, change: '+8.2%', changeType: 'increase' },
    { name: 'Tasa de Finalización', value: '78%', icon: CheckCircle, change: '+3.5%', changeType: 'increase' },
  ];

  const recentUsers = [
    { id: 1, name: 'María González', email: 'maria@example.com', joinDate: '2023-10-15', status: 'active' },
    { id: 2, name: 'Carlos Rodríguez', email: 'carlos@example.com', joinDate: '2023-10-14', status: 'active' },
    { id: 3, name: 'Ana Martínez', email: 'ana@example.com', joinDate: '2023-10-12', status: 'pending' },
    { id: 4, name: 'Juan Pérez', email: 'juan@example.com', joinDate: '2023-10-10', status: 'active' },
    { id: 5, name: 'Laura Gómez', email: 'laura@example.com', joinDate: '2023-10-08', status: 'inactive' },
  ];

  const recentCourses = [
    { id: 1, title: 'Introducción a React', instructor: 'Juan Pérez', students: 124, status: 'published' },
    { id: 2, title: 'Diseño UX/UI Avanzado', instructor: 'Laura Gómez', students: 89, status: 'published' },
    { id: 3, title: 'Machine Learning Básico', instructor: 'Carlos López', students: 0, status: 'draft' },
  ];

  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: 'Activo', bg: 'bg-green-100 text-green-800' },
      inactive: { label: 'Inactivo', bg: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pendiente', bg: 'bg-yellow-100 text-yellow-800' },
      published: { label: 'Publicado', bg: 'bg-blue-100 text-blue-800' },
      draft: { label: 'Borrador', bg: 'bg-gray-100 text-gray-800' },
    };
    const statusInfo = statuses[status] || { label: status, bg: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
        <p className="mt-1 text-sm text-gray-500">
          Resumen general y estadísticas de la plataforma
        </p>
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
                      <svg className="self-center flex-shrink-0 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="self-center flex-shrink-0 w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className="sr-only">
                      {stat.changeType === 'increase' ? 'Aumentó' : 'Disminuyó'} por
                    </span>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Usuarios Recientes</h3>
              <a href="/admin/usuarios" className="text-sm font-medium text-red-600 hover:text-red-500">
                Ver todos
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(user.status)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="overflow-hidden bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Cursos Recientes</h3>
              <a href="/admin/cursos" className="text-sm font-medium text-red-600 hover:text-red-500">
                Ver todos
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentCourses.map((course) => (
                <li key={course.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                      <p className="text-sm text-gray-500">
                        Instructor: {course.instructor}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {course.students} estudiantes
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(course.status)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Acciones Rápidas</h3>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/usuarios/nuevo"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Users className="w-5 h-5 mr-2" />
                Nuevo Usuario
              </a>
              <a
                href="/admin/cursos/nuevo"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Nuevo Curso
              </a>
              <a
                href="/admin/reportes"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <BarChart2 className="w-5 h-5 mr-2" />
                Ver Reportes
              </a>
              <a
                href="/admin/configuracion"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Configuración
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              <li className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-red-500 bg-red-100 rounded-full">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-medium text-gray-900">Nuevo usuario registrado</p>
                    <p className="text-sm text-gray-500">María González se ha registrado en la plataforma</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-blue-500 bg-blue-100 rounded-full">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-medium text-gray-900">Nuevo curso publicado</p>
                    <p className="text-sm text-gray-500">El curso "Machine Learning Básico" ha sido publicado</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Ayer</p>
                  </div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-green-500 bg-green-100 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-medium text-gray-900">Curso completado</p>
                    <p className="text-sm text-gray-500">5 estudiantes han completado el curso "Introducción a React"</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Hace 2 días</p>
                  </div>
                </div>
              </li>
              <li className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 text-yellow-500 bg-yellow-100 rounded-full">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <p className="text-sm font-medium text-gray-900">Actualización pendiente</p>
                    <p className="text-sm text-gray-500">Hay 3 cursos pendientes de revisión</p>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Hace 3 días</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div className="px-6 py-4 text-sm border-t border-gray-200">
            <a href="#" className="flex items-center font-medium text-red-600 hover:text-red-500">
              Ver toda la actividad
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
