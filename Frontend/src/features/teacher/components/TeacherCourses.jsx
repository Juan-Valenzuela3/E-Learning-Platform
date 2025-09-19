

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import { useTeacherCourses } from "@/shared/hooks/useTeacherCourses";
import { useAuth } from "@/shared/hooks/useAuth";
import { deleteCourse } from "@/services/courseService";
import { toast } from "sonner";

// Componentes de estado de carga mejorados
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-700 mt-4">Cargando tus cursos...</h3>
    <p className="text-gray-500 mt-2">Preparando el contenido</p>
  </div>
);

// Componentes de estado de error mejorados
const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Algo salió mal</h3>
    <p className="text-gray-600 mb-6 text-center max-w-md">{message}</p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:scale-105">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reintentar
    </button>
  </div>
);

// ✅ Componente de confirmación moderno (manteniendo funcionalidad)
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-semibold transition-all duration-200">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-lg">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const TeacherCourses = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  // Obtener usuario autenticado
  const { user } = useAuth();

  // Usar solo una llamada al hook
  const { courses, loading, error, refreshCourses } = useTeacherCourses(user?.id);

  // ✅ Función mejorada para eliminar curso
  const handleDeleteCourse = async (courseId, courseTitle) => {
    setConfirmDialog({
      isOpen: true,
      courseId,
      courseTitle,
    });
  };

  // ✅ Confirmar eliminación
  const confirmDelete = async () => {
    const { courseId, courseTitle } = confirmDialog;

    try {
      await deleteCourse(courseId);
      await refreshCourses();
      toast.success("Curso eliminado exitosamente");
    } catch (error) {
      toast.error(`Error al eliminar el curso: ${error.message}`);
    } finally {
      setConfirmDialog({ isOpen: false, courseId: null, courseTitle: "" });
    }
  };

  // ✅ Cancelar eliminación
  const cancelDelete = () => {
    setConfirmDialog({ isOpen: false, courseId: null, courseTitle: "" });
  };

  // Función de reintento
  const handleRetry = () => {
    refreshCourses();
  };

  // Muestra el estado de carga o error si es necesario
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={handleRetry} />;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "todos" || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* ✅ Dialog de confirmación */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el curso "${confirmDialog.courseTitle}"?\n\nEsta acción no se puede deshacer y el curso será eliminado permanentemente.\nSolo se pueden eliminar cursos sin estudiantes inscritos.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header mejorado */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Mis Cursos</h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Gestiona y organiza todos tus cursos
                  </p>
                </div>
              </div>

              {/* Estadísticas rápidas */}
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>{courses.length} cursos creados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{courses.reduce((sum, course) => sum + (course.students || 0), 0)} estudiantes totales</span>
                </div>
              </div>
            </div>

            <Link
              to="/teacher/courses/create"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-red-700 hover:to-red-800 transform hover:-translate-y-1 transition-all duration-300 group">
              <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Nuevo Curso
            </Link>
          </div>
        </div>

        {/* Filtros y búsqueda mejorados */}
        <div className="bg-white/80 backdrop-blur-sm p-6 mb-8 rounded-3xl shadow-xl border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar por título o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900">
                <option value="todos">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Borrador">Borrador</option>
                <option value="Archivado">Archivado</option>
              </select>
            </div>
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {searchTerm || statusFilter !== "todos" ? "No se encontraron cursos" : "No tienes cursos creados"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== "todos"
                ? "Intenta ajustar los filtros de búsqueda para encontrar tus cursos."
                : "Comienza creando tu primer curso para compartir tu conocimiento con el mundo."
              }
            </p>
            <Link
              to="/teacher/courses/create"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 hover:scale-105 shadow-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear mi primer curso
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                {/* Contenedor de la imagen mejorado */}
                <div className="relative h-48 w-full group overflow-hidden">
                  <img
                    src={
                      course.thumbnailUrl ||
                      course.image ||
                      generateCoursePlaceholder(course.title || "Curso")
                    }
                    alt={`Imagen de ${course.title}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay gradiente mejorado */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge de estado mejorado */}
                  <div
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      course.status === "Activo"
                        ? "bg-green-500"
                        : course.status === "Borrador"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}>
                    {course.status}
                  </div>

                  {/* Botón de play mejorado */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <button className="bg-white/95 backdrop-blur-sm text-red-600 p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-xl">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 leading-tight group-hover:text-red-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-semibold text-sm text-gray-900">
                          {course.students || 0}
                        </span>
                        <span className="text-xs text-gray-500">estudiantes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="font-semibold text-sm text-gray-900">
                          {course.rating || "4.5"}
                        </span>
                        <span className="text-xs text-gray-500">rating</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    {/* Botones de acción - MANTENIENDO EL DISEÑO ORIGINAL */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/teacher/courses/${course.id}`}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 hover:scale-105 transition-all duration-200"
                          title="Ver curso">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/teacher/courses/${course.id}/edit`}
                          className="text-gray-500 p-2 rounded-lg hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                          title="Editar curso">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteCourse(course.id, course.title)
                          }
                          className="text-red-500 p-2 rounded-lg hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                          title="Eliminar curso">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Publicado
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;