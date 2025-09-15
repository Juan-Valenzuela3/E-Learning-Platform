import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Clock, Users, ArrowLeft, X, Loader2, AlertCircle, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import courseService from '@/services/courseService';

const CatalogoCursos = () => {
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedLevel, setSelectedLevel] = useState('todos');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Estados para la carga de datos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursos, setCursos] = useState([]);
  const [categories, setCategories] = useState([{ id: 'todos', name: 'Cargando categorías...' }]);
  const [levels, setLevels] = useState([{ id: 'todos', name: 'Cargando niveles...' }]);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Función para cargar cursos con los filtros actuales
  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Construir objeto de filtros para la API
      const filters = {
        search: searchTerm || undefined,
        category: selectedCategory !== 'todos' ? selectedCategory : undefined,
        level: selectedLevel !== 'todos' ? selectedLevel : undefined,
      };
      
      const cursosData = await courseService.getCourses(filters);
      setCursos(cursosData);
    } catch (err) {
      console.error('Error al cargar los cursos:', err);
      setError('No se pudieron cargar los cursos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedLevel]);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar categorías y niveles en paralelo
        const [categoriesData, levelsData] = await Promise.all([
          courseService.getCategories(),
          courseService.getLevels()
        ]);
        
        setCategories([{ id: 'todos', name: 'Todos los cursos' }, ...categoriesData]);
        setLevels([{ id: 'todos', name: 'Todos los niveles' }, ...levelsData]);
        
        // Cargar cursos con los filtros iniciales
        await fetchCourses();
      } catch (err) {
        console.error('Error al cargar los datos iniciales:', err);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
  }, [fetchCourses]);

  // Efecto para recargar cursos cuando cambian los filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses();
    }, 500); // Debounce para evitar múltiples peticiones rápidas
    
    return () => clearTimeout(timer);
  }, [fetchCourses]);

  // Manejar la suscripción a un curso
  const handleSubscribe = (courseId, e) => {
    e?.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Lógica para suscribirse al curso
    console.log('Subscribirse al curso:', courseId);
    // Aquí iría la llamada a la API para suscribirse
  };

  // Manejar la navegación al detalle del curso
  const handleCourseAccess = (courseId) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate(`/cursos/${courseId}`);
  };

  // Cerrar el modal de autenticación
  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // Navegar al login
  const goToLogin = () => {
    navigate('/auth/login', { state: { from: window.location.pathname } });
    closeAuthModal();
  };

  // Navegar al registro
  const goToRegister = () => {
    navigate('/auth/register', { state: { from: window.location.pathname } });
    closeAuthModal();
  };

  // Alternar la expansión de un curso
  const toggleExpanded = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Obtener el color según el nivel del curso
  const getLevelColor = (level) => {
    switch (level) {
      case 'principiante':
        return 'bg-green-100 text-green-800';
      case 'intermedio':
        return 'bg-yellow-100 text-yellow-800';
      case 'avanzado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtener el color según la categoría del curso
  const getCategoryColor = (category) => {
    switch (category) {
      case 'frontend':
        return 'bg-blue-100 text-blue-800';
      case 'backend':
        return 'bg-purple-100 text-purple-800';
      case 'fullstack':
        return 'bg-indigo-100 text-indigo-800';
      case 'mobile':
        return 'bg-pink-100 text-pink-800';
      case 'data':
        return 'bg-green-100 text-green-800';
      case 'design':
        return 'bg-orange-100 text-orange-800';
      case 'devops':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filtrar cursos localmente (opcional, ya que el filtrado se hace en el servidor)
  const filteredCursos = cursos.filter((curso) => {
    if (!curso) return false;
    
    const matchesSearch = searchTerm === '' || 
      (curso.title && curso.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (curso.instructor && curso.instructor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (curso.tags && Array.isArray(curso.tags) && curso.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    const matchesCategory = selectedCategory === 'todos' || 
      (curso.category && curso.category === selectedCategory);
      
    const matchesLevel = selectedLevel === 'todos' || 
      (curso.level && curso.level === selectedLevel);

    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Catálogo de Cursos
              </h1>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-gray-600">Total de cursos</p>
              <p className="text-2xl font-bold text-red-500">
                {filteredCursos.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtro por categoría */}
            <div>
              <select
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por nivel */}
            <div>
              <select
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Botón de limpiar filtros */}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todos');
                setSelectedLevel('todos');
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Estado de carga */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin mr-3" />
            <span className="text-gray-600">Cargando cursos...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  onClick={fetchCourses}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        ) : filteredCursos.length === 0 ? (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron cursos</h3>
            <p className="mt-1 text-sm text-gray-500">
              No hay cursos que coincidan con tu búsqueda. Intenta con otros filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCursos.map((curso) => (
              <div
                key={curso.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                onClick={() => handleCourseAccess(curso.id)}
              >
                {/* Imagen del curso */}
                <div className="relative h-40 bg-gray-200">
                  {curso.image ? (
                    <img
                      src={curso.image}
                      alt={curso.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-course.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Badge de nivel */}
                  <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(curso.level)}`}>
                    {levels.find(l => l.id === curso.level)?.name || curso.level}
                  </span>
                  
                  {/* Descuento */}
                  {curso.originalPrice > curso.price && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{Math.round(((curso.originalPrice - curso.price) / curso.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Contenido del curso */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Categoría */}
                  <div className="mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(curso.category)}`}>
                      {categories.find(c => c.id === curso.category)?.name || curso.category}
                    </span>
                  </div>
                  
                  {/* Título */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {curso.title}
                  </h3>
                  
                  {/* Descripción */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
                    {curso.description}
                  </p>
                  
                  {/* Metadatos */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="flex items-center mr-4">
                      <Clock className="w-4 h-4 mr-1" />
                      {curso.duration || 'N/A'}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {(curso.students || 0).toLocaleString()}
                    </span>
                    <div className="ml-auto flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium text-gray-900">
                        {curso.rating || 'Nuevo'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Precio y botón */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-bold text-gray-900">
                          {curso.price ? `$${curso.price.toFixed(2)}` : 'Gratis'}
                        </span>
                        {curso.originalPrice > curso.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${curso.originalPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleSubscribe(curso.id, e)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-sm font-medium"
                      >
                        Inscribirse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Acceso requerido</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Necesitas iniciar sesión para acceder a este contenido.
                </p>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={goToLogin}
                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={goToRegister}
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogoCursos;
