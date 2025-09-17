// src/features/marketing/components/CursoCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/Button";
import { BookOpen, Users } from "lucide-react";

export default function CursoCard({ course, isAuthenticated = false }) {
  if (!course) {
    return (
      <Card className="flex flex-col h-full opacity-75">
        <div className="w-full h-40 bg-gray-200 animate-pulse rounded-t-lg" />
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="h-2 bg-gray-200 rounded w-full mb-2" />
          <div className="h-2 bg-gray-200 rounded w-5/6" />
        </CardContent>
        <CardFooter className="p-4 border-t border-gray-200">
          <div className="h-8 bg-gray-200 rounded w-full" />
        </CardFooter>
      </Card>
    );
  }

  const defaultImageUrl = 'https://via.placeholder.com/400x200/F3F4F6/9CA3AF?text=Curso'; // Imagen por defecto

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Imagen */}
      <div className="relative h-40 w-full bg-gray-100">
        <img
          src={course.imageUrl || defaultImageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = defaultImageUrl; }}
        />
        {course.category && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {course.category}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {course.description || 'Sin descripción'}
        </p>
        
        {course.instructor && (
          <p className="text-sm text-gray-500 mb-3">
            Por {course.instructor}
          </p>
        )}
        
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {course.studentsEnrolled || 0}
            </span>
            <BookOpen className="h-4 w-4 text-gray-500 ml-2" />
            <span className="text-sm text-gray-600">
              {course.sections || 0}
            </span>
          </div>
          
          <span className="font-bold text-gray-900">
            {course.price === 0 ? 'Gratis' : `$${course.price.toFixed(2)}`}
          </span>
        </div>
        
        <Button 
          asChild 
          className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white"
        >
          <Link to={`/cursos/${course.id}`}>
            Ver detalles
          </Link>
        </Button>
      </div>
    </div>
  )
}