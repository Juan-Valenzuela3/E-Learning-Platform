import React, { useState, useEffect } from "react";
import {
  BarChart2,
  Users,
  BookOpen,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { adminService } from "../../../services/adminService";

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [enrollmentStats, setEnrollmentStats] = useState([]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [usersData, coursesData, , statsData] = await Promise.allSettled([
        adminService.getAllUsers(),
        adminService.getActiveCourses(),
        adminService.getRecentEnrollments(),
        adminService.getEnrollmentStats(),
      ]);

      // Procesar usuarios
      const users = usersData.status === "fulfilled" ? usersData.value : [];
      const processedUsers = users
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      // Procesar cursos
      const courses =
        coursesData.status === "fulfilled" ? coursesData.value : [];
      const processedCourses = courses
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      // Procesar inscripciones (no se usa actualmente)
      // const enrollments = enrollmentsData.status === "fulfilled" ? enrollmentsData.value : [];

      // Procesar estadísticas de inscripciones
      const enrollmentStatsData =
        statsData.status === "fulfilled" ? statsData.value : [];

      // Calcular estadísticas generales
      const totalUsers = users.length;
      const totalStudents = users.filter(
        (user) => user.role === "STUDENT"
      ).length;
      const totalInstructors = users.filter(
        (user) => user.role === "INSTRUCTOR"
      ).length;
      const totalAdmins = users.filter((user) => user.role === "ADMIN").length;
      const publishedCourses = courses.filter(
        (course) => course.isPublished
      ).length;
      const unpublishedCourses = courses.filter(
        (course) => !course.isPublished
      ).length;
      const totalCourses = courses.length;

      // Calcular usuarios nuevos este mes
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newUsersThisMonth = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        return (
          userDate.getMonth() === currentMonth &&
          userDate.getFullYear() === currentYear
        );
      }).length;

      // Calcular cursos nuevos este mes
      const newCoursesThisMonth = courses.filter((course) => {
        const courseDate = new Date(course.createdAt);
        return (
          courseDate.getMonth() === currentMonth &&
          courseDate.getFullYear() === currentYear
        );
      }).length;

      // Calcular ingresos totales (simulado)
      const totalRevenue = courses.reduce((sum, course) => {
        return sum + (course.price || 0);
      }, 0);

      setStats({
        totalUsers,
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        publishedCourses,
        unpublishedCourses,
        newUsersThisMonth,
        newCoursesThisMonth,
        totalRevenue,
      });

      setRecentUsers(processedUsers);
      setRecentCourses(processedCourses);
      setEnrollmentStats(enrollmentStatsData);
    } catch (err) {
      console.error("Error loading report data:", err);
      setError("Error al cargar los datos del reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: "bg-green-100 text-green-800", text: "Activo" },
      inactive: { color: "bg-red-100 text-red-800", text: "Inactivo" },
      published: { color: "bg-green-100 text-green-800", text: "Publicado" },
      draft: { color: "bg-yellow-100 text-yellow-800", text: "Borrador" },
    };

    const config = statusConfig[status] || statusConfig.inactive;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const exportToCSV = () => {
    // Simular exportación de datos
    const csvData = [
      ["Métrica", "Valor"],
      ["Total de Usuarios", stats?.totalUsers || 0],
      ["Estudiantes", stats?.totalStudents || 0],
      ["Instructores", stats?.totalInstructors || 0],
      ["Administradores", stats?.totalAdmins || 0],
      ["Total de Cursos", stats?.totalCourses || 0],
      ["Cursos Publicados", stats?.publishedCourses || 0],
      ["Cursos No Publicados", stats?.unpublishedCourses || 0],
      ["Nuevos Usuarios Este Mes", stats?.newUsersThisMonth || 0],
      ["Nuevos Cursos Este Mes", stats?.newCoursesThisMonth || 0],
      ["Ingresos Totales", formatCurrency(stats?.totalRevenue || 0)],
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reporte-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Análisis y estadísticas de la plataforma
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar reportes
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadReportData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Reportes y Análisis
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Estadísticas detalladas y análisis de la plataforma
          </p>
        </div>
        <div className="mt-4 flex space-x-3 md:mt-0 md:ml-4">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
          <button
            onClick={loadReportData}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-red-50">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Usuarios
              </p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <TrendingUp className="self-center flex-shrink-0 w-5 h-5 text-green-500" />
                  <span className="sr-only">Aumentó por</span>+
                  {stats?.newUsersThisMonth || 0} este mes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-blue-50">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Cursos
              </p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.totalCourses || 0}
                </p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  <TrendingUp className="self-center flex-shrink-0 w-5 h-5 text-green-500" />
                  <span className="sr-only">Aumentó por</span>+
                  {stats?.newCoursesThisMonth || 0} este mes
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">
                Ingresos Totales
              </p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats?.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 overflow-hidden bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-md bg-yellow-50">
              <BarChart2 className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">
                Tasa de Publicación
              </p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stats?.totalCourses > 0
                    ? Math.round(
                        (stats.publishedCourses / stats.totalCourses) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* User Distribution */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Distribución de Usuarios
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Administradores
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats?.totalAdmins || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Instructores
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats?.totalInstructors || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Estudiantes
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats?.totalStudents || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Course Status */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Estado de Cursos
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Publicados
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats?.publishedCourses || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">
                    Borradores
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {stats?.unpublishedCourses || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Usuarios Recientes
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {user.userName.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.userName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                      <div className="ml-auto">
                        <div className="text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </div>
                        <div className="mt-1">
                          {getStatusBadge(user.active ? "active" : "inactive")}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Courses */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Cursos Recientes
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="flow-root">
              <ul className="divide-y divide-gray-200">
                {recentCourses.map((course) => (
                  <li key={course.id} className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {course.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {course.instructor?.userName}{" "}
                          {course.instructor?.lastName}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-sm text-gray-500">
                          {formatDate(course.createdAt)}
                        </div>
                        <div className="mt-1">
                          {getStatusBadge(
                            course.isPublished ? "published" : "draft"
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Stats */}
      {enrollmentStats.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">
              Estadísticas de Inscripciones por Curso
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Inscripciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completadas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollmentStats.map((stat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {stat.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.totalEnrollments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.activeEnrollments}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stat.completedEnrollments}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
