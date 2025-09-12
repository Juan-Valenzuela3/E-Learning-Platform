import React, { useState } from "react";
import { Star, Users, BookOpen, Clock, Award, Play, ChevronDown, ChevronUp, Heart, Share2 } from "lucide-react";

import { Link } from "react-router-dom";

export default function CursoDisponible() {
  const [expandedCourse, setExpandedCourse] = useState(null);

  const featuredCourses = [
    {
      id: 1,
      title: "Full Stack con React y Spring Boot",
      instructor: "Carlos Mendoza",
      rating: 4.9,
      students: 1250,
      duration: "40 horas",
      lessons: 85,
      price: "$149",
      originalPrice: "$199",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center",
      category: "PROGRAMACIÓN",
      level: "Intermedio",
      categoryColor: "bg-red-500",
      description: "Aprende a crear aplicaciones web completas desde el frontend hasta el backend. Domina React para la interfaz de usuario y Spring Boot para la lógica del servidor.",
      whatYouLearn: [
        "Fundamentos de React y Spring Boot",
        "Arquitectura de aplicaciones web",
        "APIs RESTful y bases de datos",
        "Despliegue y DevOps básico"
      ],
      requirements: [
        "Conocimientos básicos de JavaScript",
        "Familiaridad con HTML y CSS",
        "Computadora con conexión a internet"
      ]
    },
    {
      id: 2,
      title: "Machine Learning con Python",
      instructor: "Ana García",
      rating: 4.8,
      students: 890,
      duration: "35 horas",
      lessons: 72,
      price: "$109",
      originalPrice: "$149",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop&crop=center",
      category: "DATA SCIENCE",
      level: "Avanzado",
      categoryColor: "bg-gray-700",
      description: "Sumérgete en el mundo del machine learning y la inteligencia artificial. Aprende algoritmos, técnicas de procesamiento de datos y aplicaciones prácticas.",
      whatYouLearn: [
        "Algoritmos de machine learning",
        "Procesamiento y limpieza de datos",
        "Modelos predictivos y clasificación",
        "Evaluación y optimización de modelos"
      ],
      requirements: [
        "Python intermedio",
        "Matemáticas básicas",
        "Lógica de programación"
      ]
    },
    {
      id: 3,
      title: "UI/UX Design System",
      instructor: "María López",
      rating: 4.9,
      students: 2100,
      duration: "25 horas",
      lessons: 58,
      price: "$129",
      originalPrice: "$179",
      image:
        "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop&crop=center",
      category: "DISEÑO",
      level: "Intermedio",
      categoryColor: "bg-red-600",
      description: "Crea sistemas de diseño coherentes y escalables. Aprende principios de UX, herramientas de diseño y metodologías para crear experiencias excepcionales.",
      whatYouLearn: [
        "Principios de UX/UI",
        "Sistemas de diseño",
        "Prototipado y testing",
        "Herramientas de diseño modernas"
      ],
      requirements: [
        "Creatividad y sentido estético",
        "Familiaridad con herramientas digitales",
        "Interés en experiencia de usuario"
      ]
    },
    {
      id: 4,
      title: "Marketing Digital Avanzado",
      instructor: "Diego Ruiz",
      rating: 4.7,
      students: 670,
      duration: "30 horas",
      lessons: 65,
      price: "$89",
      originalPrice: "$129",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop&crop=center",
      category: "MARKETING",
      level: "Principiante",
      categoryColor: "bg-gray-800",
      description: "Domina las estrategias de marketing digital más efectivas. Aprende SEO, publicidad online, redes sociales y análisis de datos para impulsar tu negocio.",
      whatYouLearn: [
        "SEO y optimización web",
        "Publicidad en redes sociales",
        "Email marketing y automatización",
        "Analytics y métricas clave"
      ],
      requirements: [
        "Conocimientos básicos de internet",
        "Interés en marketing",
        "Dispositivo con conexión web"
      ]
    },
  ];

  const toggleExpanded = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

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
          {featuredCourses.map((course) => {
            const isExpanded = expandedCourse === course.id;

            return (
              <div
                key={course.id}
                className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-500 border border-gray-100 overflow-hidden transform hover:-translate-y-1 ${
                  isExpanded ? 'shadow-xl scale-[1.02]' : ''
                }`}>

                {/* Imagen y badges */}
                <div className="relative">
                  <img
                    src={course.image}
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
                      {course.instructor}
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
                        {course.students.toLocaleString()}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {course.lessons}
                      </div>
                    </div>
                  </div>

                  {/* Información expandida */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 pt-4 mb-4 space-y-4 animate-in slide-in-from-top-2 duration-300">

                      {/* Descripción */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Descripción</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{course.description}</p>
                      </div>

                      {/* Lo que aprenderás */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Lo que aprenderás</h4>
                        <div className="space-y-1">
                          {course.whatYouLearn.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span className="text-xs text-gray-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* pre Requisitos previos para seguir este curso*/}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Requisitos</h4>
                        <div className="space-y-1">
                          {course.requirements.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                              <span className="text-xs text-gray-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Estadísticas detalladas */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <Clock className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                          <div className="text-xs font-bold text-gray-900">{course.duration}</div>
                          <div className="text-xs text-gray-500">Duración</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <BookOpen className="w-4 h-4 text-green-500 mx-auto mb-1" />
                          <div className="text-xs font-bold text-gray-900">{course.lessons}</div>
                          <div className="text-xs text-gray-500">Lecciones</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer con precios y botones */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-red-500">
                        {course.price}
                      </span>
                      <span className="text-sm text-gray-400 line-through">
                        {course.originalPrice}
                      </span>
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
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                          <Play className="w-3 h-3" />
                          Vista previa
                        </button>
                        <button className="flex-1 bg-red-500 text-white py-2 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-1">
                          <Award className="w-3 h-3" />
                          Comprar ahora
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">

      <Link
            to="/cursos"
            className="border-2 bg-primary-300  border-b-gray-400 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-400  transition-all duration-300 flex items-center justify-center">
            Ver catálogo completo
          </Link>
          </div>
      </div>


    </section>
  );
}