import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, Calendar, BookOpen } from 'lucide-react';

const Students = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulate API
        await new Promise(r => setTimeout(r, 600));
        const mockCourses = [
          {
            id: 'course-1',
            title: 'Desarrollo Web Moderno',
            students: 89,
            rating: 4.5,
            status: 'Publicado',
            lastUpdated: '19 jun 2023',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=60',
          },
          {
            id: 'course-2',
            title: 'Introducción a la Programación con Python',
            students: 124,
            rating: 4.7,
            status: 'Publicado',
            lastUpdated: '14 may 2023',
            thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=300&q=60',
          },
          {
            id: 'course-3',
            title: 'Machine Learning para Principiantes',
            students: 56,
            rating: 4.3,
            status: 'Borrador',
            lastUpdated: '9 jul 2023',
            thumbnail: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=300&q=60',
          },
        ];
        setCourses(mockCourses);
      } catch (e) {
        console.error('Error fetching courses', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Mis Cursos</h2>
        <div className="w-full sm:w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar curso..."
              className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos</h3>
          <p className="mt-1 text-sm text-gray-500">Crea un curso para ver alumnos inscritos.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filtered.map((course) => (
              <li key={course.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-12 w-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-indigo-600">
                        <Link to={`/teacher/students/${course.id}`}>{course.title}</Link>
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" /> {course.students}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" /> {course.rating}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" /> {course.lastUpdated}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${course.status === 'Publicado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {course.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Haz clic para ver los estudiantes inscritos en este curso</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Students;
