import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BookOpen, Clock, Users, Star, FileText, Video, Check } from 'lucide-react';

const CourseTemplates = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: 'Curso Básico de Programación',
      description: 'Introducción a la programación con ejemplos prácticos',
      category: 'programacion',
      duration: '8 semanas',
      modules: 6,
      rating: 4.7,
      students: 1250,
      thumbnail: 'https://via.placeholder.com/300x180/FFE4E6/EF4444?text=Programación',
      content: {
        modules: [
          'Introducción a la programación',
          'Variables y tipos de datos',
          'Estructuras de control',
          'Funciones y módulos',
          'Estructuras de datos básicas',
          'Proyecto final'
        ],
        resources: [
          { type: 'video', title: 'Introducción al curso', duration: '15 min' },
          { type: 'quiz', title: 'Cuestionario inicial', questions: 10 },
          { type: 'document', title: 'Guía de instalación' }
        ]
      }
    },
    {
      id: 2,
      title: 'Diseño Web Moderno',
      description: 'Aprende a crear sitios web responsivos con HTML5, CSS3 y JavaScript',
      category: 'diseno',
      duration: '6 semanas',
      modules: 5,
      rating: 4.8,
      students: 980,
      thumbnail: 'https://via.placeholder.com/300x180/DBEAFE/3B82F6?text=Diseño+Web',
      content: {
        modules: [
          'Fundamentos de HTML5',
          'Estilos con CSS3',
          'Diseño responsivo',
          'JavaScript básico',
          'Proyecto final'
        ]
      }
    },
    {
      id: 3,
      title: 'Marketing Digital',
      description: 'Estrategias efectivas de marketing en redes sociales',
      category: 'marketing',
      duration: '4 semanas',
      modules: 4,
      rating: 4.5,
      students: 750,
      thumbnail: 'https://via.placeholder.com/300x180/D1FAE5/10B981?text=Marketing',
      content: {
        modules: [
          'Introducción al Marketing Digital',
          'Redes Sociales',
          'Publicidad en línea',
          'Análisis de métricas'
        ]
      }
    },
    {
      id: 4,
      title: 'Fotografía Profesional',
      description: 'Domina los conceptos básicos de la fotografía',
      category: 'fotografia',
      duration: '5 semanas',
      modules: 5,
      rating: 4.9,
      students: 620,
      thumbnail: 'https://via.placeholder.com/300x180/EDE9FE/8B5CF6?text=Fotografía',
      content: {
        modules: [
          'Conociendo tu cámara',
          'Composición fotográfica',
          'Iluminación natural',
          'Edición básica',
          'Proyecto final'
        ]
      }
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todas las categorías' },
    { id: 'programacion', name: 'Programación' },
    { id: 'diseno', name: 'Diseño' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'negocios', name: 'Negocios' },
    { id: 'fotografia', name: 'Fotografía' },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template) => {
    // Aquí iría la lógica para usar la plantilla
    console.log('Usando plantilla:', template);
    // Navegar al editor de cursos con los datos de la plantilla
  };

  const previewTemplate = (template) => {
    // Aquí iría la lógica para previsualizar la plantilla
    console.log('Vista previa de:', template.title);
  };

  const renderResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'quiz':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plantillas de Cursos</h1>
          <p className="text-gray-600">Selecciona una plantilla para comenzar a crear tu curso</p>
        </div>
        <button 
          onClick={() => navigate('/teacher/courses/new/custom')}
          className="mt-4 md:mt-0 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Crear desde cero
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Buscar plantillas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-2" />
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 rounded-lg"
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
        </div>
      </div>

      {/* Lista de plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={template.thumbnail} 
                alt={template.title} 
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-medium text-gray-700 flex items-center">
                <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                {template.rating}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{template.title}</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-red-500" />
                  {template.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1 text-blue-500" />
                  {template.modules} módulos
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-green-500" />
                  {template.students.toLocaleString()}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contenido:</h4>
                <ul className="space-y-1">
                  {template.content.modules.slice(0, 3).map((module, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      <span className="truncate">{module}</span>
                    </li>
                  ))}
                  {template.content.modules.length > 3 && (
                    <li className="text-sm text-gray-500 pl-6">+{template.content.modules.length - 3} más</li>
                  )}
                </ul>
                
                {template.content.resources && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recursos incluidos:</h4>
                    <div className="flex flex-wrap gap-2">
                      {template.content.resources.map((resource, index) => (
                        <div key={index} className="flex items-center text-xs bg-gray-50 rounded-full px-2 py-1">
                          {renderResourceIcon(resource.type)}
                          <span className="ml-1">
                            {resource.type === 'video' ? 'Video' : resource.type === 'quiz' ? 'Cuestionario' : 'Documento'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => useTemplate(template)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                >
                  Usar plantilla
                </button>
                <button
                  onClick={() => previewTemplate(template)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Vista previa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron plantillas</h3>
          <p className="mt-1 text-gray-500">Intenta con otros términos de búsqueda o categorías.</p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTemplates;
