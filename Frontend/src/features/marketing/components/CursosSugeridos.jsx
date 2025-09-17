// src/features/marketing/components/CursosSugeridos.jsx

import React from "react";
import { Link } from "react-router-dom";
import CursoCard from "@/features/marketing/components/CursoCard"; 
import CtaButton from "@/features/marketing/components/CTAButton"; 

export default function CursosSugeridos({ courses }) {
  const coursesToDisplay = Array.isArray(courses) ? courses.slice(0, 4) : [];

  return (
    <section className="py-12 bg-gray-50 rounded-lg shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Cursos Sugeridos
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Descubre lo que tenemos para ti. Inscríbete para acceder al catálogo completo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0">
          {coursesToDisplay.map((course) => (
           
            <CursoCard key={course.id} course={course} isAuthenticated={false} />
          ))}
        </div>
        <div className="mt-12">
          <Link
            to="/cursos"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-100 hover:bg-primary-200"
          >
            Explorar todos los cursos
          </Link>
        </div>
      </div>
    </section>
  );
}