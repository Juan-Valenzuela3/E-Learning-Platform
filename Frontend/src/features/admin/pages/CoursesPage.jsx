import { useState } from 'react';
import { Search, Filter, Plus, BookOpen, Clock, CheckCircle, XCircle, Pencil, Trash2, X,ChevronLeft, ChevronRight } from 'lucide-react';

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  // Mock data - replace with actual API call
  const courses = [
    { 
      id: 1, 
      title: 'Introducción a React', 
      instructor: 'Juan Pérez', 
      category: 'Desarrollo Web',
      students: 124, 
      price: 49.99, 
      status: 'published',
      createdAt: '2023-09-15',
      rating: 4.7,
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: 2, 
      title: 'Diseño UX/UI Avanzado', 
      instructor: 'Laura Gómez', 
      category: 'Diseño',
      students: 89, 
      price: 59.99, 
      status: 'published',
      createdAt: '2023-09-10',
      rating: 4.8,
      image: 'https://via.placeholder.com/150'
    },
    { 
      id: 3, 
      title: 'Machine Learning Básico', 
      instructor: 'Carlos López', 
      category: 'Ciencia de Datos',
      students: 0, 
      price: 79.99, 
      status: 'draft',
      createdAt: '2023-10-01',
      rating: 0,
      image: 'https://via.placeholder.com/150'
    },
  ];

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || course.status === filters.status;
    const matchesCategory = filters.category === 'all' || course.category === filters.category;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // 
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
    });
    setSearchTerm('');
  };

  const getStatusBadge = (status) => {
    const statuses = {
      published: { label: 'Publicado', bg: 'bg-green-100 text-green-800' },
      draft: { label: 'Borrador', bg: 'bg-yellow-100 text-yellow-800' },
      archived: { label: 'Archivado', bg: 'bg-gray-100 text-gray-800' },
    };
    const statusInfo = statuses[status] || { label: status, bg: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h2>
          <p className="mt-1 text-sm text-gray-500">
            Administra los cursos de la plataforma
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Curso
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-2 pl-10 pr-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Buscar por título o instructor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="published">Publicados</option>
                <option value="draft">Borradores</option>
                <option value="archived">Archivados</option>
              </select>
            </div>
            
            <div className="relative">
              <select
                className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                <option value="Desarrollo Web">Desarrollo Web</option>
                <option value="Diseño">Diseño</option>
                <option value="Ciencia de Datos">Ciencia de Datos</option>
                <option value="Marketing">Marketing</option>
                <option value="Negocios">Negocios</option>
              </select>
            </div>
            
            {(filters.status !== 'all' || filters.category !== 'all') && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Curso
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Categoría
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Instructor
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Estudiantes
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Estado
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-10 h-10">
                              <img className="w-10 h-10 rounded-md" src={course.image} alt={course.title} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500">
                                {course.rating > 0 ? (
                                  <div className="flex items-center">
                                    <span className="text-yellow-400">★</span>
                                    <span className="ml-1">{course.rating.toFixed(1)}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Sin calificaciones</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.students}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatPrice(course.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(course.status)}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-2">
                            <button className="text-red-600 hover:text-red-900">
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-sm text-center text-gray-500 whitespace-nowrap">
                        No se encontraron cursos que coincidan con los filtros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredCourses.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 rounded-md ${
                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium border border-gray-300 rounded-md ${
                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Siguiente
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{indexOfFirstCourse + 1}</span> a{' '}
                <span className="font-medium">
                  {indexOfLastCourse > filteredCourses.length ? filteredCourses.length : indexOfLastCourse}
                </span>{' '}
                de <span className="font-medium">{filteredCourses.length}</span> cursos
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-l-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentPage === number
                        ? 'z-10 bg-red-50 border-red-500 text-red-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } border`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-r-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
