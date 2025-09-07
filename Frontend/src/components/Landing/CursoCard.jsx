import React from "react";
import { Star, Users, BookOpen } from "lucide-react";

export default function CursoDisponible() {
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
    },
  ];

  return (
    <section id="Cursos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Cursos Disponibles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Cada curso es una inversión única en tu futuro profesional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:-translate-y-2">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span
                    className={`${course.categoryColor} text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider`}>
                    {course.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                  <span className="text-xs font-bold text-gray-600">
                    {course.level}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-500 transition-colors">
                  {course.title}
                </h3>

                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <span className="text-gray-600 font-medium">
                    {course.instructor}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      <span className="text-sm font-bold">{course.rating}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {course.lessons} lecciones
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-red-500">
                      {course.price}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {course.originalPrice}
                    </span>
                  </div>
                  <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors group-hover:scale-105">
                    Ver curso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
