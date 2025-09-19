import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import { getCourseById, deleteCourse } from "@/services/courseService";
import { getStudentsByCourseId } from "@/services/courseService";
import { generateCoursePlaceholder } from "@/utils/imageUtils";
import LoadingSpinner from "@/shared/components/LoadingSpinner";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Cargar datos reales del curso
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        setError("ID de curso no válido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`🔍 Cargando curso con ID: ${id}`);

        // Cargar datos del curso
        const courseData = await getCourseById(id);
        console.log("📋 Datos del curso recibidos:", courseData);

        // Adaptar los datos del backend al formato esperado por el componente
        const adaptedCourse = {
          id: courseData.id,
          title: courseData.title || "Sin título",
          description:
            courseData.description ||
            courseData.shortDescription ||
            "Sin descripción",
          instructor:
            courseData.instructorName ||
            courseData.instructor ||
            "Sin instructor",
          students:
            courseData.enrollmentCount || courseData.studentsEnrolled || 0,
          rating: courseData.rating || 4.5,
          duration: courseData.estimatedHours
            ? `${courseData.estimatedHours} horas`
            : "No especificado",
          level: courseData.difficulty || courseData.level || "No especificado",
          category:
            courseData.categoryName || courseData.category || "Sin categoría",
          price: courseData.price || 0,
          status:
            courseData.status ||
            (courseData.isPublished ? "published" : "draft"),
          imageUrl:
            courseData.thumbnailUrl ||
            courseData.imageUrl ||
            generateCoursePlaceholder(courseData.title),
          // Datos adicionales que podríamos necesitar
          isPublished: courseData.isPublished || false,
          isActive: courseData.isActive || false,
          createdAt: courseData.createdAt,
          updatedAt: courseData.updatedAt,
          // Datos mock para campos que no vienen del backend aún
          modules: courseData.modules || [
            {
              id: 1,
              title: "Contenido del curso",
              lessons: [
                {
                  id: 1,
                  title: "Introducción",
                  type: "video",
                  duration: "15 min",
                  completed: false,
                },
              ],
            },
          ],
          statistics: {
            completionRate: courseData.completionRate || 0,
            avgScore: courseData.avgScore || 0,
            totalEnrollments: courseData.enrollmentCount || 0,
            activeStudents: courseData.activeStudents || 0,
          },
        };

        setCourse(adaptedCourse);

        // Cargar estudiantes del curso si es necesario
        try {
          const studentsData = await getStudentsByCourseId(id);
          console.log("👥 Estudiantes del curso:", studentsData);

          // Adaptar datos de estudiantes
          const adaptedStudents = studentsData.map((student, index) => ({
            name: student.userName || student.name || `Estudiante ${index + 1}`,
            progress: student.progress || Math.floor(Math.random() * 100), // Mock si no hay progreso real
            lastActive: student.lastActive || student.lastLogin || "1d ago",
          }));

          setStudents(adaptedStudents);
          setStudentCount(adaptedStudents.length);
        } catch (studentsError) {
          console.error("❌ Error al cargar estudiantes:", studentsError);
          // No es crítico, continuar sin estudiantes
          setStudents([]);
          setStudentCount(0);
        }
      } catch (error) {
        console.error("❌ Error al cargar el curso:", error);
        setError(error.message || "Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  // Función para eliminar curso
  const handleDelete = async () => {
    if (!course?.title) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de que deseas eliminar el curso "${course.title}"?\n\n` +
        "Esta acción no se puede deshacer y el curso será eliminado permanentemente."
    );

    if (!confirmDelete) {
      setShowDeleteModal(false);
      return;
    }

    try {
      setDeleting(true);
      console.log(`🗑️ Eliminando curso ${id}`);

      await deleteCourse(id);

      console.log("✅ Curso eliminado exitosamente");
      alert("Curso eliminado exitosamente");
      navigate("/teacher/courses");
    } catch (error) {
      console.error("❌ Error al eliminar curso:", error);
      alert(`Error al eliminar el curso: ${error.message}`);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Función para cargar estudiantes
  const loadStudents = useCallback(async () => {
    if (!course?.id) return;

    setLoadingStudents(true);
    try {
      console.log(`�� Cargando estudiantes para el curso ${course.id}...`);
      const studentsData = await getStudentsByCourseId(course.id);
      console.log(`✅ Estudiantes cargados:`, studentsData);

      setStudents(studentsData);
      setStudentCount(studentsData.length);
    } catch (error) {
      console.error("❌ Error al cargar estudiantes:", error);
      setStudents([]);
      setStudentCount(0);
    } finally {
      setLoadingStudents(false);
    }
  }, [course?.id]);

  // Cargar estudiantes cuando cambie el curso
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" text="Cargando curso..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error al cargar el curso
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Reintentar
            </button>
            <Link
              to="/teacher/courses"
              className="block w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-center">
              Volver a mis cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">
          Curso no encontrado
        </h3>
        <p className="mt-2 text-gray-500">
          El curso que estás buscando no existe o no tienes permiso para verlo.
        </p>
        <div className="mt-6">
          <Link
            to="/teacher/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
            Volver a mis cursos
          </Link>
        </div>
      </div>
    );
  }

  // Función para obtener el color del estado
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
      case "activo":
        return "bg-green-500 text-white";
      case "draft":
      case "borrador":
        return "bg-yellow-500 text-white";
      case "archived":
      case "archivado":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "published":
        return "Publicado";
      case "draft":
        return "Borrador";
      case "archived":
        return "Archivado";
      case "activo":
        return "Activo";
      case "borrador":
        return "Borrador";
      case "archivado":
        return "Archivado";
      default:
        return status || "Sin estado";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <Link
            to="/teacher/courses"
            className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  course.status
                )}`}>
                {getStatusText(course.status)}
              </span>
              {course.category && (
                <>
                  <span className="text-gray-500 text-sm">
                    {course.category}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                </>
              )}
              <span className="text-gray-500 text-sm">{course.level}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to={`/teacher/courses/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Editar
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
            {deleting ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>

      {/* Course stats */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = generateCoursePlaceholder(course.title);
              }}
            />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {course.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Por {course.instructor}
            </p>
            {course.price > 0 && (
              <p className="mt-1 text-lg font-semibold text-green-600">
                ${course.price}
              </p>
            )}
          </div>
          <div className="ml-auto flex items-center space-x-6">
            <div className="flex items-center text-yellow-400">
              <StarIcon className="h-5 w-5" />
              <span className="ml-1 text-gray-600">{course.rating}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-1" />
              {loadingStudents ? (
                <span className="animate-pulse">Cargando...</span>
              ) : (
                `${studentCount} estudiantes`
              )}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
              {course.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {["overview", "content", "students", "analytics"].map((tab) => {
            const tabTitles = {
              overview: "Resumen",
              content: "Contenido",
              students: "Estudiantes",
              analytics: "Análisis",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                {tabTitles[tab]}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Descripción del curso
              </h3>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>

            {/* Información adicional del curso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Detalles del curso
                </h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Nivel:</dt>
                    <dd className="text-sm text-gray-900">{course.level}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Categoría:</dt>
                    <dd className="text-sm text-gray-900">{course.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Duración estimada:
                    </dt>
                    <dd className="text-sm text-gray-900">{course.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Precio:</dt>
                    <dd className="text-sm text-gray-900">
                      {course.price === 0 ? "Gratis" : `$${course.price}`}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Estadísticas
                </h4>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">
                      Estudiantes inscritos:
                    </dt>
                    <dd className="text-sm text-gray-900">{course.students}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Rating promedio:</dt>
                    <dd className="text-sm text-gray-900">{course.rating}/5</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Estado:</dt>
                    <dd className="text-sm text-gray-900">
                      {getStatusText(course.status)}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Contenido del curso
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {course.modules.length} módulo(s) disponible(s)
              </p>
            </div>
            <ul className="divide-y divide-gray-200">
              {course.modules.map((module) => (
                <li key={module.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      {module.title}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {module.lessons.length} lección(es)
                    </span>
                  </div>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {module.lessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {lesson.type === "video" && (
                            <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
                          )}
                          {lesson.type === "quiz" && (
                            <DocumentTextIcon className="h-5 w-5 text-yellow-500 mr-3" />
                          )}
                          {lesson.type === "exercise" && (
                            <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-3" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-4">
                            {lesson.duration}
                          </span>
                          {lesson.completed ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "students" && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Estudiantes inscritos
                </h3>
                <span className="text-sm text-gray-500">
                  {loadingStudents ? (
                    <span className="animate-pulse">Cargando...</span>
                  ) : (
                    `${studentCount} estudiante(s)`
                  )}
                </span>
              </div>
            </div>
            {students.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <li key={index} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {student.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Última conexión: {student.lastActive}
                        </p>
                      </div>
                      <div className="w-48">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>{student.progress}%</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-indigo-600 h-2.5 rounded-full"
                            style={{ width: `${student.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-6 py-8 text-center">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No hay estudiantes inscritos aún.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Estadísticas del curso
              </h3>
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tasa de finalización
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.completionRate}%
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Puntuación promedio
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.avgScore}%
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Estudiantes activos
                  </dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.activeStudents}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información adicional
              </h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Fecha de creación
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.createdAt
                      ? new Date(course.createdAt).toLocaleDateString("es-ES")
                      : "No disponible"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Última actualización
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.updatedAt
                      ? new Date(course.updatedAt).toLocaleDateString("es-ES")
                      : "No disponible"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Estado de publicación
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {course.isPublished ? "Publicado" : "No publicado"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Eliminar curso
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de que deseas eliminar el curso "
                      {course.title}"? Esta acción no se puede deshacer y se
                      eliminarán todos los datos asociados.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  onClick={handleDelete}
                  disabled={deleting}>
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
