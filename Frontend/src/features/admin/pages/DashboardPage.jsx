import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowRight,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  BarChart2,
} from "lucide-react";
import { adminService } from "../../../services/adminService";


export default function DashboardPage() {
  // Estados para los datos
  const [stats, setStats] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState(null);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener solo los totales desde /api/admin/stats
        const statsData = await adminService.getStats();
        const userStats = statsData.userStats || {};

        // Construir el array de stats para la UI
        const processedStats = [
          {
            name: "Usuarios Totales",
            value: userStats.totalUsers?.toString() || "0",
            icon: Users,
            change: `+${userStats.newUsersLast30Days ?? 0}`,
            changeType: "increase",
          },
          {
            name: "Cursos Activos",
            value: statsData.courseStats?.publishedCourses?.toString() || "0",
            icon: BookOpen,
            change: `+0`, // Ajustar si hay campo de nuevos cursos
            changeType: "increase",
          },
          {
            name: "Estudiantes",
            value: userStats.totalStudents?.toString() || "0",
            icon: Users,
            change: `+0`, // Ajustar si hay campo de nuevos estudiantes
            changeType: "increase",
          },
          {
            name: "Instructores",
            value: userStats.totalInstructors?.toString() || "0",
            icon: Award,
            change: `+0`, // Ajustar si hay campo de nuevos instructores
            changeType: "increase",
          },
        ];

        setStats(processedStats);
        // Las siguientes secciones pueden seguir usando los arrays completos si es necesario
        // setRecentUsers(...)
        // setRecentCourses(...)
        // setRecentEnrollments(...)
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    const statuses = {
      active: { label: "Activo", bg: "bg-green-100 text-green-800" },
      inactive: { label: "Inactivo", bg: "bg-gray-100 text-gray-800" },
      pending: { label: "Pendiente", bg: "bg-yellow-100 text-yellow-800" },
      published: { label: "Publicado", bg: "bg-blue-100 text-blue-800" },
      draft: { label: "Borrador", bg: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statuses[status] || {
      label: status,
      bg: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {statusInfo.label}
      </span>
    );
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general y estadísticas de la plataforma
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Cargando datos del dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar estado de error
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel de Control</h2>
          <p className="mt-1 text-sm text-gray-500">
            Resumen general y estadísticas de la plataforma
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar datos
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Panel de Administración
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Gestión completa de usuarios, cursos y estadísticas de la plataforma
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-md bg-red-50">
                <stat.icon className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                    {stat.changeType === "increase" ? (
                      <svg
                        className="self-center flex-shrink-0 w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="self-center flex-shrink-0 w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="sr-only">
                      {stat.changeType === "increase" ? "Aumentó" : "Disminuyó"}{" "}
                      por
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Usuarios Recientes
              </h3>
              <a
                href="/admin/usuarios"
                className="text-sm font-medium text-red-600 hover:text-red-500">
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
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    <div className="ml-auto">
                      <div className="text-sm text-gray-500">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </div>
                      <div className="mt-1">{getStatusBadge(user.status)}</div>
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
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Cursos Recientes
              </h3>
              <a
                href="/admin/cursos"
                className="text-sm font-medium text-red-600 hover:text-red-500">
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
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {course.title}
                      </p>
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Acciones Rápidas
          </h3>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="/admin/usuarios/nuevo"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <Users className="w-5 h-5 mr-2" />
                Nuevo Usuario
              </a>
              <a
                href="/admin/cursos/nuevo"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <BookOpen className="w-5 h-5 mr-2" />
                Nuevo Curso
              </a>
              <a
                href="/admin/reportes"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <BarChart2 className="w-5 h-5 mr-2" />
                Ver Reportes
              </a>
              <a
                href="/admin/configuracion"
                className="inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Actividad Reciente
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200">
              {recentEnrollments.length > 0 ? (
                recentEnrollments.map((enrollment) => (
                  <li key={enrollment.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-2 text-blue-500 bg-blue-100 rounded-full">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0 ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          Nueva inscripción
                        </p>
                        <p className="text-sm text-gray-500">
                          {enrollment.student} se ha inscrito en "
                          {enrollment.course}"
                        </p>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">
                          {new Date(
                            enrollment.enrollmentDate
                          ).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="px-6 py-4">
                  <div className="text-center text-gray-500">
                    <p>No hay actividad reciente</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className="px-6 py-4 text-sm border-t border-gray-200">
            <a
              href="/admin/usuarios"
              className="flex items-center font-medium text-red-600 hover:text-red-500">
              Ver toda la actividad
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
