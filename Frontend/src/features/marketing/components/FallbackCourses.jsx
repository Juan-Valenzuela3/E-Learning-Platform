import React from "react";
import { Star, Users, BookOpen, Clock, Award, Play } from "lucide-react";
import { Link } from "react-router-dom";

const FallbackCourses = () => {
  const fallbackCourses = [
    {
      id: 1,
      title: "Curso de React Básico",
      description:
        "Aprende los fundamentos de React desde cero. Este curso te enseñará todo lo necesario para crear aplicaciones web modernas.",
      shortDescription: "Fundamentos de React para principiantes",
      instructor: { userName: "Juan Pérez" },
      category: { name: "Programación" },
      price: 0,
      isPremium: false,
      rating: 4.8,
      students: 1250,
      estimatedHours: 20,
      thumbnailUrl: null,
    },
    {
      id: 2,
      title: "JavaScript Avanzado",
      description:
        "Domina JavaScript moderno con ES6+, async/await, promesas y patrones avanzados de programación.",
      shortDescription: "JavaScript moderno y patrones avanzados",
      instructor: { userName: "María García" },
      category: { name: "Programación" },
      price: 49.99,
      isPremium: true,
      rating: 4.9,
      students: 890,
      estimatedHours: 35,
      thumbnailUrl: null,
    },
    {
      id: 3,
      title: "Diseño UI/UX",
      description:
        "Aprende a crear interfaces de usuario atractivas y experiencias de usuario excepcionales.",
      shortDescription: "Diseño de interfaces y experiencia de usuario",
      instructor: { userName: "Carlos López" },
      category: { name: "Diseño" },
      price: 29.99,
      isPremium: true,
      rating: 4.7,
      students: 650,
      estimatedHours: 25,
      thumbnailUrl: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {fallbackCourses.map((course) => (
        <div
          key={course.id}
          className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {/* Imagen del curso */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-white text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm font-medium">{course.category.name}</p>
            </div>
            {course.isPremium && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                PREMIUM
              </div>
            )}
          </div>

          {/* Contenido del curso */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.shortDescription}
            </p>

            {/* Instructor */}
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-600 text-sm font-medium">
                  {course.instructor.userName.charAt(0)}
                </span>
              </div>
              <span className="text-gray-700 text-sm">
                {course.instructor.userName}
              </span>
            </div>

            {/* Estadísticas */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span>{course.rating}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.students}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{course.estimatedHours}h</span>
              </div>
            </div>

            {/* Precio y botón */}
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {course.price === 0 ? "Gratis" : `$${course.price}`}
              </div>
              <Link
                to={`/curso/${course.id}`}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
                <Play className="w-4 h-4 mr-2" />
                Ver Curso
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FallbackCourses;
