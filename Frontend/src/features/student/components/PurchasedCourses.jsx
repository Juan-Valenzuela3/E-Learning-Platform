import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/Button';
import { Progress } from '@/ui/progress';
import { BookOpen, Clock, Award, Star, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getEnrolledCourses } from '@/features/course/services';

export default function PurchasedCourses() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getEnrolledCourses();
        if (active) setCourses(data);
      } catch (e) {
        if (active) setError('No se pudieron cargar tus cursos.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const getFilteredCourses = () => {
    if (currentPath.includes('en-progreso')) {
      return courses.filter(course => course.status === 'en-progreso');
    } else if (currentPath.includes('completados')) {
      return courses.filter(course => course.status === 'completados');
    } else if (currentPath.includes('guardados')) {
      return []; // No saved courses yet
    }
    return courses; // Show all courses
  };

  const filteredCourses = getFilteredCourses();
  const isCompletedView = currentPath.includes('completados');
  const hasNoCourses = !loading && filteredCourses.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentPath.includes('en-progreso') && 'Cursos en Progreso'}
          {currentPath.includes('completados') && 'Cursos Completados'}
          {currentPath.includes('guardados') && 'Cursos Guardados'}
          {!currentPath.includes('en-progreso') &&
            !currentPath.includes('completados') &&
            !currentPath.includes('guardados') && 'Mis Cursos'}
        </h1>
        <p className="text-gray-600">
          {isCompletedView
            ? 'Tus cursos completados aparecerán aquí'
            : 'Continúa aprendiendo donde lo dejaste'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-md bg-red-50 text-red-700 border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="h-40 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : hasNoCourses && isCompletedView ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No has completado ningún curso aún</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Completa tus cursos en progreso o explora nuevos cursos para comenzar tu aprendizaje.
          </p>
          <Button asChild>
            <Link to="/cursos">Explorar Cursos</Link>
          </Button>
        </div>
      ) : hasNoCourses ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No hay cursos para mostrar</h3>
          <p className="text-gray-600 mb-6">
            No se encontraron cursos en esta categoría.
          </p>
          <Button asChild>
            <Link to="/cursos">Explorar Cursos</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {course.rating}
                </div>
                <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  {course.category}
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription>Por {course.instructor}</CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {course.completedLessons}/{course.totalLessons} lecciones
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {course.lastAccessed}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              </CardContent>

              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" asChild>
                  <Link to={`/curso/${course.id}`}>
                    {course.progress === 100 ? 'Ver de nuevo' : 'Continuar'}
                  </Link>
                </Button>
                {course.progress === 100 && (
                  <div className="flex items-center text-sm text-green-600">
                    <Award className="h-4 w-4 mr-1" />
                    Completado
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}