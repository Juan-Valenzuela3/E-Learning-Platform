import React from "react";
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  ArrowRight,
  Play,
  Clock,
  Award,
  Star,
} from "lucide-react";

export default function HeroSection() {
  // Usar las nuevas variables de entorno configuradas
  const isDevelopment = import.meta.env.DEV === true;
  const appTitle = import.meta.env.VITE_APP_TITLE || "EduPlatform";
  const debugMode = import.meta.env.VITE_DEBUG_MODE === "false";

  // Debug: mostrar en consola
  console.log("🚀 HeroSection - import.meta.env:", import.meta.env);
  console.log("🎯 HeroSection - DEV:", import.meta.env.DEV);
  console.log("📱 HeroSection - isDevelopment:", isDevelopment);
  console.log("🏷️ HeroSection - appTitle:", appTitle);
  console.log("🐛 HeroSection - debugMode:", debugMode);

  const stats = [
    { number: "150+", label: "Cursos" },
    { number: "4.8", label: "Rating" },
    { number: "25k+", label: "Estudiantes" },
    { number: "10+", label: "Instructores" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">


        {/* Badge de desarrollo */}
        {isDevelopment && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center bg-white rounded-full px-6 py-2 shadow-lg border border-gray-200">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                {appTitle} - Modo Desarrollo
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Aprende con los{" "}
              <span className="text-red-500 relative">
                mejores cursos
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-red-200 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
              paga solo por lo que necesitas
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl">
              Sin suscripciones. Sin compromisos. Compra el curso que quieras,
              cuando quieras, y accede a él para siempre.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link
                to="/cursos"
                className="group bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
              >
                Ver cursos disponibles
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/comoFunciona"
                className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg hover:border-red-500 hover:text-red-500 transition-all duration-300 flex items-center justify-center"
              >
                <Play className="mr-2 w-5 h-5" />
                Ver cómo funciona
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:pl-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-red-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                    <Play className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Curso destacado
                    </h3>
                    <p className="text-gray-500">Full Stack Development</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Vista previa
                    </span>
                  </div>

                  {/* Imagen del curso */}
                  <div className="overflow-hidden rounded-xl shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop&crop=center"
                      alt="Curso Full Stack"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      2.5 horas de contenido
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      Certificado incluido
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">24</div>
                  <div className="text-xs text-gray-500">Lecciones</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">4.9</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">1.2k</div>
                  <div className="text-xs text-gray-500">Estudiantes</div>
                </div>
              </div>
            </div>

            {/* Iconos decorativos */}
            <div className="absolute -top-6 -right-6 bg-green-100 rounded-full p-3 shadow-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-blue-100 rounded-full p-3 shadow-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
