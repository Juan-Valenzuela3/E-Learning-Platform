import React, { useState, useEffect } from "react";
import { Star, Users, BookOpen, Clock, Award, Play, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getCourses } from "@/services/courseService";


export default function CursoDisponible() {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [courses, setCourses] = useState([]); // ✅ Estado para los cursos de la API
  const [loading, setLoading] = useState(true); // ✅ Estado de carga
  const [error, setError] = useState(null); // ✅ Estado de error

  //TODO: Cargar los curso desde la api
useEffect(() => {
  getCourses()
    .then(data => {
      console.log("Datos recibidos de la API:", data);

      // Forzar la conversión a array si tiene forma de array
      if (data && typeof data === 'object' && data.length >= 0) {
        setCourses([...data]);
      } else {
        console.error("Formato de datos desconocido:", data);
        setCourses([]);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error al cargar los cursos:", err);
      setError("Error al cargar los cursos. Por favor, inténtalo de nuevo más tarde.");
      setLoading(false);
      setCourses([]);
    });
}, []);



  const toggleExpanded = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // ✅ Renderizado condicional basado en el estado
  if (loading) {
    return (
      <section id="Cursos" className="py-12 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-gray-600">Cargando cursos...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="Cursos" className="py-12 bg-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg-md:px-8">
          <p className="text-xl text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="Cursos" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cursos Disponibles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Haz clic en "Ver detalles" para expandir la información completa de cada curso
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-5">
          {courses && courses.length > 0 ? (
            courses.map((course) => {
              const isExpanded = expandedCourse === course.id;

              return (
                <div
                  key={course.id}
                  className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1 ${isExpanded ? 'shadow-xl scale-[1.02]' : ''
                    }`}>

                  {/* Imagen y badges */}
                  <div className="relative">
                    <img
                      src={course.image?.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2">
                      <span
                        className={`${course.categoryColor} text-white px-2 py-1 rounded-full text-xs font-bold tracking-wider`}>
                        {course.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 shadow-md">
                      <span className="text-xs font-bold text-gray-600">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Contenido básico */}
                  <div className="p-3">
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
                      {course.title}
                    </h3>

                    <div className="flex items-center mb-3">
                      <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600 font-medium">
                        {course.instructor ? `${course.instructor.userName} ${course.instructor.lastName}` : 'Instructor anónimo'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 fill-current mr-1" />
                          <span className="text-xs font-bold">
                            {course.rating}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="w-3 h-3 mr-1" />
                          {course.students?.toLocaleString() ?? 0}
                        </div>

                      </div>
                    </div>

                    {/* Información expandida */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 pt-4 mb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">

                        {/* Descripción */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>

                            <p className="m-2 text-gray-600 text-sm leading-relaxed break-all whitespace-pre-line ">{course.description}</p>


                        </div>

                        {/* Estadísticas detalladas
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <Clock className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                            <div className="text-xs font-bold text-gray-900">{course.estimatedHours} hora</div>
                            <div className="text-xs text-gray-500">Duración</div>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <BookOpen className="w-4 h-4 text-green-500 mx-auto mb-1" />
                            <div className="text-xs font-bold text-gray-900">{course.sections?.length || 0} secciones</div>
                            <div className="text-xs text-gray-500">Secciones</div>
                          </div>
                        </div>*/}
                      </div>

                    )}

                    {/* Footer con precios y botones */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-red-500">
                          {course.price ? `$${course.price}` : 'Gratis'}
                        </span>
                        {course.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${course.originalPrice}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">

                        <button
                          onClick={() => toggleExpanded(course.id)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3" />
                              Ocultar
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3" />
                              Ver detalles
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Botón de compra expandido */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-gray-100 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="flex gap-2">
                          <Link
                            to={`/curso/${course.id}`}
                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            Vista previa
                          </Link>
                          <Link
                            to={`/curso/${course.id}`}
                            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                          >
                            <Award className="w-3 h-3" />
                            Ver curso
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No hay cursos disponibles en este momento.</p>
          )}
        </div>
      </div>
    </section>
  );
}