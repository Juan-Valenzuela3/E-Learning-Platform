import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  CheckCircleIcon
} from '@heroicons/react/24/solid';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock course data
        const mockCourse = {
          id: id,
          title: 'Introducción a la Programación con Python',
          description: 'Aprende los fundamentos de programación utilizando Python. Este curso cubre desde conceptos básicos hasta estructuras de datos avanzadas.',
          instructor: 'Prof. Carlos Rodríguez',
          students: 124,
          rating: 4.7,
          duration: '8 semanas',
          level: 'Principiante',
          category: 'Programación',
          price: 49.99,
          imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
          modules: [
            {
              id: 1,
              title: 'Módulo 1: Introducción a Python',
              lessons: [
                { id: 1, title: 'Instalación y configuración', type: 'video', duration: '15 min', completed: true },
                { id: 2, title: 'Hola Mundo y sintaxis básica', type: 'video', duration: '20 min', completed: true },
                { id: 3, title: 'Variables y tipos de datos', type: 'video', duration: '25 min', completed: false },
                { id: 4, title: 'Cuestionario: Conceptos básicos', type: 'quiz', duration: '10 min', completed: false },
              ]
            },
            {
              id: 2,
              title: 'Módulo 2: Estructuras de control',
              lessons: [
                { id: 5, title: 'Condicionales if/else', type: 'video', duration: '18 min', completed: false },
                { id: 6, title: 'Bucles for y while', type: 'video', duration: '22 min', completed: false },
                { id: 7, title: 'Ejercicios prácticos', type: 'exercise', duration: '30 min', completed: false },
              ]
            },
            {
              id: 3,
              title: 'Módulo 3: Funciones y módulos',
              lessons: [
                { id: 8, title: 'Definición de funciones', type: 'video', duration: '20 min', completed: false },
                { id: 9, title: 'Parámetros y valores de retorno', type: 'video', duration: '25 min', completed: false },
                { id: 10, title: 'Módulos y paquetes', type: 'video', duration: '15 min', completed: false },
              ]
            }
          ],
          studentsProgress: [
            { name: 'María González', progress: 75, lastActive: '2h ago' },
            { name: 'Juan Pérez', progress: 50, lastActive: '1d ago' },
            { name: 'Ana Martínez', progress: 25, lastActive: '3d ago' },
            { name: 'Carlos Sánchez', progress: 10, lastActive: '1w ago' },
          ],
          statistics: {
            completionRate: 68,
            avgScore: 82,
            totalEnrollments: 124,
            activeStudents: 87,
          }
        };

        setCourse(mockCourse);
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleDelete = () => {
    // Handle course deletion
    console.log(`Deleting course ${id}`);
    // In a real app, you would call an API to delete the course
    // Then navigate back to the courses list
    navigate('/teacher/courses');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Curso no encontrado</h3>
        <p className="mt-2 text-gray-500">El curso que estás buscando no existe o no tienes permiso para verlo.</p>
        <div className="mt-6">
          <Link
            to="/teacher/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
            Volver a mis cursos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <Link
            to="/teacher/courses"
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to={`/teacher/courses/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
            Editar
          </Link>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Course stats */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
            <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{course.title}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{course.instructor}</p>
          </div>
          <div className="ml-auto flex items-center">
            <div className="flex items-center text-yellow-400">
              <StarIcon className="h-5 w-5" />
              <span className="ml-1 text-gray-600">{course.rating}</span>
            </div>
            <div className="ml-6 flex items-center text-sm text-gray-500">
              <UserGroupIcon className="h-5 w-5 text-gray-400 mr-1" />
              {course.students} estudiantes
            </div>
            <div className="ml-6 flex items-center text-sm text-gray-500">
              <ClockIcon className="h-5 w-5 text-gray-400 mr-1" />
              {course.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'content', 'students', 'analytics'].map((tab) => {
            const tabTitles = {
              overview: 'Resumen',
              content: 'Contenido',
              students: 'Estudiantes',
              analytics: 'Análisis'
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${activeTab === tab
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tabTitles[tab]}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Descripción del curso</h3>
              <p className="mt-2 text-gray-600">{course.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Lo que aprenderás</h3>
              <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Los fundamentos de programación con Python</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Estructuras de datos básicas y avanzadas</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Programación orientada a objetos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Manejo de archivos y excepciones</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {course.modules.map((module) => (
                <li key={module.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">{module.title}</h4>
                    <span className="text-sm text-gray-500">{module.lessons.length} lecciones</span>
                  </div>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          {lesson.type === 'video' && (
                            <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
                          )}
                          {lesson.type === 'quiz' && (
                            <DocumentTextIcon className="h-5 w-5 text-yellow-500 mr-3" />
                          )}
                          {lesson.type === 'exercise' && (
                            <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-3" />
                          )}
                          <span className="text-sm font-medium text-gray-900">{lesson.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-4">{lesson.duration}</span>
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

        {activeTab === 'students' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Estudiantes inscritos</h3>
                <span className="text-sm text-gray-500">{course.students} estudiantes</span>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {course.studentsProgress.map((student, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">Última conexión: {student.lastActive}</p>
                    </div>
                    <div className="w-48">
                      <div className="flex justify-between text-sm">
                        <span>Progreso</span>
                        <span>{student.progress}%</span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas del curso</h3>
              <dl className="space-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tasa de finalización</dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.completionRate}%
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Puntuación promedio</dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.avgScore}%
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estudiantes activos</dt>
                  <dd className="mt-1 flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {course.statistics.activeStudents}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <span>+5.4%</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Progreso de los estudiantes</h3>
              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div key={module.id}>
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>{module.title}</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full" 
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Eliminar curso</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      ¿Estás seguro de que deseas eliminar este curso? Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm"
                  onClick={handleDelete}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
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