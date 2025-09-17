import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/Button';
import { Progress } from '@/ui/progress';
import { BookOpen, Clock, Award, Star, AlertCircle } from 'lucide-react';
import { getActiveEnrollments, getCompletedEnrollments, getEnrolledCourses } from '@/services/enrollmentService'; // ✅ Importamos los servicios de la API

export default function PurchasedCourses() {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentPath = location.pathname;

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError('');
        let data = [];

        // ✅ Llama a la API correcta según la URL
        if (currentPath.includes('en-progreso')) {
          data = await getActiveEnrollments();
        } else if (currentPath.includes('completados')) {
          data = await getCompletedEnrollments();
        } else {
          data = await getEnrolledCourses();
        }

        setCourses(data);
      } catch (e) {
        setError('No se pudieron cargar tus cursos.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [currentPath]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-lg overflow-hidden shadow-md animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-2 bg-gray-100 rounded w-full mt-4"></div>
              <div className="h-2 bg-gray-100 rounded w-5/6 mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <AlertCircle className="w-10 h-10 mx-auto mb-2" />
        <p>No tienes cursos en esta categoría.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardHeader>
        <CardTitle
        className='text-2xl'
        >Mis Cursos</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => {
          // Asumiendo que el campo de progreso viene de la API
          const progressPercentage = course.progress || 0;
          const status = course.status || 'ACTIVE';
          return (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative">
                {/* Asumiendo que la API tiene un campo para la imagen */}
                <img
                  src={course.image || 'https://via.placeholder.com/400x200'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                {course.instructor?.userName && (
                  <CardDescription className="text-sm">
                    Instructor: {course.instructor.userName} {course.instructor.lastName}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {status === 'COMPLETED' ? (
                  <div className="flex items-center text-sm text-green-600">
                    <Award className="h-4 w-4 mr-1" />
                    Completado
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span className="font-medium">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4">
                <Link to={`/curso/${course.id}/content`} className="w-full">
                  <Button className="w-full">
                    {status === 'COMPLETED' ? 'Ver de nuevo' : 'Continuar'}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}