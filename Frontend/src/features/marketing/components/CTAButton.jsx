import React from "react";
import { ArrowRight, Shield, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaButton() {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-red-500 opacity-10"></div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          Comienza tu próxima aventura de aprendizaje
        </h2>
        <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Más de 1,000 estudiantes ya han transformado sus carreras con nuestros
          cursos. ¿Cuál será tu próximo paso?
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <a
            href="login"
            className="group bg-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center">
            Quiero aprender
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <Link
            to="/cursos"
            className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center justify-center">
            Ver catálogo completo
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-gray-300">
          <div className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            <span className="text-sm">Garantía de 30 días</span>
          </div>
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" />
            <span className="text-sm">Certificado oficial</span>
          </div>
          <div className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            <span className="text-sm">Acceso de por vida</span>
          </div>
        </div>
      </div>
    </section>
  );
}
